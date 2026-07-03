/**
 * .NET SDK Check Module
 * Checks for .NET SDK installation and version
 */

import { $ } from "bun";
import { logDebug, logInfo, logWarn, logError } from "../lib/logger";
import { commandExists } from "../lib/utils";

export interface DotnetInfo {
  installed: boolean;
  version?: string;
  efToolInstalled: boolean;
  scriptToolInstalled: boolean;
}

export async function checkDotnet(): Promise<DotnetInfo> {
  logDebug("Checking for .NET SDK...");

  const dotnetExists = await commandExists("dotnet");

  if (!dotnetExists) {
    logDebug(".NET SDK not found in PATH");
    return {
      installed: false,
      efToolInstalled: false,
      scriptToolInstalled: false,
    };
  }

  try {
    // Check if we can execute dotnet commands
    const versionOutput = await $`dotnet --version`.text().catch(() => "");
    const version = versionOutput.trim();

    if (!version) {
      logDebug("User not allowed to run dotnet --version");
      return {
          installed: false,
          efToolInstalled: false,
          scriptToolInstalled: false,
      };
    }

    logDebug(`.NET SDK version: ${version}`);

    // Check for dotnet tools (only if version check succeeded)
    const efToolInstalled = await checkDotnetEfTool().catch(() => false);
    const scriptToolInstalled = await checkDotnetScriptTool().catch(() => false);

    return {
      installed: true,
      version,
      efToolInstalled,
      scriptToolInstalled,
    };
  } catch (error) {
    logDebug(`Error checking .NET: ${error instanceof Error ? error.message : "Unknown error"}`);
    return {
      installed: false,
      efToolInstalled: false,
      scriptToolInstalled: false,
    };
  }
}

async function checkDotnetEfTool(): Promise<boolean> {
  try {
    // Check if user has permission to run dotnet tool commands
    await $`dotnet tool list --global`.quiet();
    const toolListOutput = await $`dotnet tool list --global`.text().catch(() => "");
    return toolListOutput.includes("dotnet-ef");
  } catch {
    logDebug("User may not have permission to check dotnet-ef tool");
    return false;
  }
}

async function checkDotnetScriptTool(): Promise<boolean> {
  try {
    // Check if user has permission to run dotnet tool commands
    await $`dotnet tool list --global`.quiet();
    const toolListOutput = await $`dotnet tool list --global`.text().catch(() => "");
    return toolListOutput.includes("dotnet-script");
  } catch {
    logDebug("User may not have permission to check dotnet-script tool");
    return false;
  }
}

export async function installDotnetEfTool(): Promise<boolean> {
  try {
    logInfo("Installing dotnet-ef tool...");
    const result = await $`dotnet tool install --global dotnet-ef`.quiet();
        
    // Verify installation succeeded
    if (result.exitCode !== 0) {
        logError("dotnet-ef installation failed (permission denied or other error)");
        return false;
    }
        
    logInfo("dotnet-ef tool installed successfully");
    return true;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    logError(`Failed to install dotnet-ef: ${errorMsg}`);
        
    // Provide more specific guidance for common errors
    if (errorMsg.includes("permission") || errorMsg.includes("access denied")) {
        logWarn("Try running: sudo -E dotnet tool install --global dotnet-ef");
        logWarn("Or visit: https://aka.ms/dotnet-tools for manual installation");
    }
        
    return false;
  }
}

export async function installDotnetScriptTool(): Promise<boolean> {
  try {
    logInfo("Installing dotnet-script tool...");
    const result = await $`dotnet tool install --global dotnet-script`.quiet();
        
    // Verify installation succeeded
    if (result.exitCode !== 0) {
        logError("dotnet-script installation failed (permission denied or other error)");
        return false;
    }
        
    logInfo("dotnet-script tool installed successfully");
    return true;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    logError(`Failed to install dotnet-script: ${errorMsg}`);
        
    // Provide more specific guidance for common errors
    if (errorMsg.includes("permission") || errorMsg.includes("access denied")) {
        logWarn("Try running: sudo -E dotnet tool install --global dotnet-script");
        logWarn("Or visit: https://github.com/filipw/dotnet-script for manual installation");
    }
        
    return false;
  }
}

export function getDotnetInstallInstructions(osType: string): string {
  const baseUrl = "https://dotnet.microsoft.com/download";

  switch (osType) {
    case "linux":
      return `
Install .NET SDK 10.0 on Linux:

1. Visit: ${baseUrl}
2. Or use package manager:
   
   Ubuntu/Debian:
   wget https://dot.net/v1/dotnet-install.sh
   chmod +x dotnet-install.sh
   ./dotnet-install.sh --channel 10.0
   
   Fedora/RHEL:
   sudo dnf install dotnet-sdk-10.0
`;

    case "darwin":
      return `
Install .NET SDK 10.0 on macOS:

1. Visit: ${baseUrl}
2. Or use Homebrew:
   brew install --cask dotnet-sdk
`;

    case "windows":
      return `
Install .NET SDK 10.0 on Windows:

1. Visit: ${baseUrl}
2. Download and run the installer
3. Restart your terminal after installation
`;

    default:
      return `Visit ${baseUrl} to download .NET SDK 10.0`;
  }
}

export function isVersionCompatible(version: string): boolean {
  // Check if version is 10.x or higher
  const majorVersion = parseInt(version.split(".")[0] ?? "0", 10);
  return majorVersion >= 10;
}

export function showDotnetStatus(info: DotnetInfo, osType: string): void {
  if (!info.installed) {
    logError(".NET SDK is not installed");
    logWarn(getDotnetInstallInstructions(osType));
    return;
  }

  if (info.version && !isVersionCompatible(info.version)) {
    logWarn(`.NET SDK ${info.version} is installed, but version 10.0 or higher is required`);
    logWarn(getDotnetInstallInstructions(osType));
    return;
  }

  logInfo(`.NET SDK ${info.version ?? "unknown"} is installed ✓`);

  if (!info.efToolInstalled) {
    logWarn("dotnet-ef tool is not installed");
    logInfo("Run: dotnet tool install --global dotnet-ef");
  } else {
    logInfo("dotnet-ef tool is installed ✓");
  }

  if (!info.scriptToolInstalled) {
    logWarn("dotnet-script tool is not installed");
    logInfo("Run: dotnet tool install --global dotnet-script");
  } else {
    logInfo("dotnet-script tool is installed ✓");
  }
}
