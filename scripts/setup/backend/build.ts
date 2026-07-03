/**
 * Backend Build Module
 * Builds the .NET backend project
 */

import { $ } from "bun";
import { logInfo, logSuccess, logError, logWarn, logDebug, startSpinner, stopSpinner } from "../lib/logger";

export interface BuildResult {
  success: boolean;
  output?: string;
  error?: string;
  duration?: number;
}

/**
 * Stop any running backend processes that might lock DLL files
 */
async function stopRunningBackendProcesses(): Promise<boolean> {
  logDebug("Checking for running backend processes...");

  try {
    // Check if Api process is running (Windows)
    const checkProc = Bun.spawn(["powershell", "-Command", "Get-Process -Name 'Api' -ErrorAction SilentlyContinue"], {
      stdout: "pipe",
      stderr: "pipe",
    });

    await checkProc.exited;
    const output = await new Response(checkProc.stdout).text();

    if (output.trim() && output.includes("Api")) {
      logInfo("Stopping running backend process...");
      startSpinner("Stopping Api process...");

      // Kill the process
      const killProc = Bun.spawn(["powershell", "-Command", "Stop-Process -Name 'Api' -Force -ErrorAction SilentlyContinue"], {
        stdout: "pipe",
        stderr: "pipe",
      });

      await killProc.exited;
      
      // Wait a bit for the process to fully terminate
      await Bun.sleep(2000);

      stopSpinner(true, "Backend process stopped");
      return true;
    }

    logDebug("No running backend processes found");
    return true;
  } catch (error) {
    logDebug(`Error checking for running processes: ${error instanceof Error ? error.message : "Unknown error"}`);
    // Continue anyway - this is not critical
    return true;
  }
}

/**
 * Restore NuGet packages
 */
export async function restorePackages(): Promise<BuildResult> {
  logInfo("Restoring NuGet packages...");

  // Stop any running backend processes first
  await stopRunningBackendProcesses();

  startSpinner("Running dotnet restore...");
  const startTime = Date.now();

  try {
    // First check if we can run dotnet commands
    await $`dotnet --version`.quiet();
        
    // Now proceed with restore
    const result = await $`dotnet restore backend/Api/Api.csproj`.text();
    const duration = Date.now() - startTime;

    stopSpinner(true, `Packages restored in ${String(Math.round(duration / 1000))}s`);
    logDebug("Restore output:");
    logDebug(result);

    return {
      success: true,
      output: result,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    stopSpinner(false, "Package restore failed");
        
    logError(`Restore error: ${errorMessage}`);
        
    // Extract detailed error information if available
    let stderr = "";
    if (error && typeof error === "object" && "stderr" in error) {
      stderr = String(error.stderr);
      logDebug("Error details:");
      logDebug(stderr);
    }
        
    // Provide specific troubleshooting guidance
    logInfo("");
    logInfo("Troubleshooting steps:");
        
    if (errorMessage.includes("permission") || errorMessage.includes("access denied") || errorMessage.includes("not allowed")) {
      logWarn("  ❯ Permission issue detected");
      logInfo("  1. Try running with elevated permissions:");
      logInfo("     sudo -E dotnet restore backend/Api/Api.csproj");
      logInfo("  2. Check your .NET SDK installation:");
      logInfo("     dotnet --info");
    }
    else if (errorMessage.includes("Unable to load the service index for source") || stderr.includes("401") || stderr.includes("403")) {
      logWarn("  ❯ NuGet feed authentication issue");
      logInfo("  1. Check your NuGet package sources:");
      logInfo("     dotnet nuget list source");
      logInfo("  2. Update credentials for private feeds");
      logInfo("  3. Try adding the official NuGet feed:");
      logInfo("     dotnet nuget add source https://api.nuget.org/v3/index.json -n nuget.org");
    }
    else if (errorMessage.includes("does not exist") || stderr.includes("does not exist")) {
      logWarn("  ❯ Project file not found");
      logInfo("  1. Verify the project path:");
      logInfo("     ls backend/Api/Api.csproj");
      logInfo("  2. Run from the project root directory");
    }
    else if (stderr.includes("Network is unreachable") || stderr.includes("No such host") || errorMessage.includes("internet")) {
      logWarn("  ❯ Network connectivity issue");
      logInfo("  1. Check your internet connection");
      logInfo("  2. Verify DNS resolution");
      logInfo("  3. Check firewall settings");
    }
    else {
      logWarn("  ❯ General troubleshooting");
      logInfo("  1. Clear NuGet cache:");
      logInfo("     dotnet nuget locals all --clear");
      logInfo("  2. Manually restore packages:");
      logInfo("     cd backend/Api && dotnet restore");
      logInfo("  3. Check .NET SDK version:");
      logInfo("     dotnet --version");
      logInfo("     (Should be 10.0.x or higher)");
    }
        
    logInfo("  4. For more help:");
    logInfo("     https://learn.microsoft.com/en-us/nuget/troubleshooting-package-restoration");
    logInfo("");

    return {
      success: false,
      error: errorMessage,
      duration,
    };
  }
}

/**
 * Build the backend project
 */
export async function buildBackend(configuration = "Release"): Promise<BuildResult> {
  logInfo(`Building backend (${configuration})...`);

  startSpinner("Compiling .NET project...");
  const startTime = Date.now();

  try {
    // First check if we can run dotnet commands
    await $`dotnet --version`.quiet();
        
    const result = await $`dotnet build backend/Api/Api.csproj --configuration ${configuration} --no-restore`.text();
    const duration = Date.now() - startTime;

    stopSpinner(true, `Build completed in ${String(Math.round(duration / 1000))}s`);
    logDebug("Build output:");
    logDebug(result);

    return {
      success: true,
      output: result,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    stopSpinner(false, "Build failed");
    logError(`Build error: ${errorMessage}`);

    // Try to extract more details from the error
    if (error && typeof error === "object" && "stderr" in error) {
      const stderr = String(error.stderr);
      if (stderr) {
        logDebug("Error details:");
        logDebug(stderr);
      }
    }

    // Provide more specific guidance
    if (errorMessage.includes("permission") || errorMessage.includes("access denied") || errorMessage.includes("not allowed")) {
      logWarn("You don't have permission to run dotnet commands.");
      logWarn("Try:");
      logWarn("  1. Running with admin/sudo permissions");
      logWarn("  2. Manually building: cd backend/Api && dotnet build");
      logWarn("  3. Checking your .NET SDK installation");
    }

    return {
      success: false,
      error: errorMessage,
      duration,
    };
  }
}

/**
 * Clean build artifacts
 */
export async function cleanBackend(): Promise<BuildResult> {
  logInfo("Cleaning build artifacts...");

  startSpinner("Running dotnet clean...");

  try {
    // First check if we can run dotnet commands
    await $`dotnet --version`.quiet();
        
    const result = await $`dotnet clean backend/Api/Api.csproj`.text();

    stopSpinner(true, "Clean completed");
    logDebug(result);

    return {
      success: true,
      output: result,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    stopSpinner(false, "Clean failed");
    logError(`Clean error: ${errorMessage}`);

    // Provide more specific guidance
    if (errorMessage.includes("permission") || errorMessage.includes("access denied") || errorMessage.includes("not allowed")) {
      logWarn("You don't have permission to run dotnet commands.");
      logWarn("Try:");
      logWarn("  1. Running with admin/sudo permissions");
      logWarn("  2. Manually cleaning: cd backend/Api && dotnet clean");
      logWarn("  3. Checking your .NET SDK installation");
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Build backend with restore
 */
export async function setupBackendBuild(): Promise<boolean> {
  logInfo("Setting up backend build...");
  logInfo("");

  // Check .NET SDK availability first
  try {
    await $`dotnet --version`.quiet();
  } catch {
    logError(".NET SDK is not properly accessible");
    logInfo("");
    logInfo("Please ensure:");
    logInfo("  1. .NET SDK 10.0 is installed");
    logInfo("  2. dotnet command is in your PATH");
    logInfo("  3. You have permission to run dotnet commands");
    logInfo("");
    logInfo("For installation help:");
    logInfo("  https://dotnet.microsoft.com/download");
    logInfo("");
    return false;
  }

  // Restore packages
  const restoreResult = await restorePackages();
  if (!restoreResult.success) {
    logError("Failed to restore packages");
    logInfo("");
    logInfo("Additional troubleshooting:");
    logInfo(" ❯ Quick fixes to try:");
    logInfo("   • Clear NuGet cache: dotnet nuget locals all --clear");
    logInfo("   • Use official NuGet feed: dotnet nuget add source https://api.nuget.org/v3/index.json -n nuget.org");
    logInfo(" • Install nuget CLI: dotnet tool install --global dotnet-nuget");
    logInfo("");
    return false;
  }

  logInfo("");

  // Build project
  const buildResult = await buildBackend();
  if (!buildResult.success) {
    logError("Failed to build backend");
    logInfo("");
    logInfo("Troubleshooting steps:");
    logInfo(" 1. Check for compilation errors in the output above");
    logInfo(" 2. Ensure all dependencies are installed");
    logInfo(" 3. Try running manually: cd backend/Api && dotnet build");
    logInfo(" 4. Check for missing project references");
    logInfo(" 5. Verify .NET SDK version matches project requirements");
    logInfo("");
    return false;
  }

  logInfo("");
  logSuccess("Backend build completed successfully!");
  return true;
}
