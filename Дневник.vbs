Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")

scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
shell.CurrentDirectory = scriptDir

If Not fso.FolderExists(scriptDir & "\node_modules") Then
    ' First run: show the window so install progress and errors are visible
    shell.Run "cmd /c """ & scriptDir & "\Запустить.bat""", 1, True
Else
    ' Normal run: start the server silently in the background, no terminal window
    shell.Run "cmd /c npm run dev", 0, False
    WScript.Sleep 4000
    shell.Run "http://localhost:5173", 1, False
End If
