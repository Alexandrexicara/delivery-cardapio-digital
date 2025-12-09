var fso = new ActiveXObject("Scripting.FileSystemObject");
var file = fso.OpenTextFile("usuario.html", 1);
var content = file.ReadAll();
file.Close();
var count = 0;
var pos = content.indexOf('style="');
while (pos !== -1) {
count++;
pos = content.indexOf('style="', pos + 1);
}
WScript.Echo("Found " + count + " instances of inline styles");