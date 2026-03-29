$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [System.Environment]::GetFolderPath('Desktop')
$Shortcut = $WshShell.CreateShortcut("$DesktopPath\Hub de Electronica I.lnk")
$Shortcut.TargetPath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$Shortcut.Arguments = "--app=""C:\Users\Sargas-PC\Desktop\Proyectos\Sistema_SEN\electronica_i_web\index.html"""
$Shortcut.IconLocation = "C:\Users\Sargas-PC\Desktop\Proyectos\Sistema_SEN\electronica_i_web\favicon.ico"
$Shortcut.Description = "Laboratorio Virtual de Electronica I - UDO"
$Shortcut.WorkingDirectory = "C:\Users\Sargas-PC\Desktop\Proyectos\Sistema_SEN\electronica_i_web"
$Shortcut.Save()
Write-Host "Acceso directo creado en el escritorio con el nuevo icono."
