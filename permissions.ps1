# PowerShell script to set execute permissions on script files

Write-Host "Setting executable permissions for ICBC Study Hub scripts..."

$files = @(
    "setup.sh",
    "setup-mongodb.sh", 
    "setup-server.sh", 
    "startup.sh", 
    "entrypoint.sh", 
    "deploy.sh"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        # Unblock the file if it was downloaded from the internet
        Unblock-File -Path $file
        
        # Set execute permissions
        $acl = Get-Acl $file
        $accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule(
            "$env:USERNAME", 
            "FullControl", 
            "Allow"
        )
        $acl.SetAccessRule($accessRule)
        Set-Acl $file $acl
        
        Write-Host "Permissions set for $file"
    } else {
        Write-Host "File not found: $file" -ForegroundColor Yellow
    }
}

Write-Host "Done setting permissions!" -ForegroundColor Green
Write-Host ""
Write-Host "To run these scripts in a Linux environment like WSL or your server, use:"
Write-Host "  chmod +x *.sh" -ForegroundColor Cyan
Write-Host "  ./setup.sh" -ForegroundColor Cyan
Write-Host "" 