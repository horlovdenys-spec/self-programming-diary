Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")

scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
shell.CurrentDirectory = scriptDir

If Not fso.FolderExists(scriptDir & "\node_modules") Then
    ' Первый запуск: показываем окно, чтобы было видно установку и возможные ошибки
    shell.Run "cmd /c """ & scriptDir & "\Запустить.bat""", 1, True
Else
    ' Обычный запуск: сервер стартует незаметно в фоне, окно терминала не появляется
    shell.Run "cmd /c npm run dev", 0, False
    WScript.Sleep 4000
    shell.Run "http://localhost:5173", 1, False
End If
