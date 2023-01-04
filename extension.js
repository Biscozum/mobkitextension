const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
	console.log('Congratulations, your extension "MobkitGenerator" is now active!');
	let typeAnswer;
	let descriptionAnswer;
	let setTextData = vscode.commands.registerCommand('biscozum.addAnnotation', async function () {
		typeAnswer = await vscode.window.showQuickPick(
			[
				{ label: 'string', description: 'Type', detail: 'A value of type String' },
				{ label: 'int', description: 'Type', detail: 'A value of type Int' }
			],
			{ placeHolder: 'You must specify a type for the annotation you want to add.' });
		if (typeAnswer == null) {
			await vscode.window.showInformationMessage("You must specify a type for the annotation you want to add.");
			return;
		}
		descriptionAnswer = await vscode.window.showQuickPick(
			[
				{ label: 'Yes', description: 'yes', detail: "I want to get the enum's description" },
				{ label: 'No', description: 'no', detail: "I don't want to get the enum's description" }
			],
			{ placeHolder: 'You have to specify if you want to get annotation with enums' });
		if (descriptionAnswer == null) {
			await vscode.window.showInformationMessage("You have to specify if you want to get annotation with enums");
			return;
		}
		let textDoc = vscode.window.activeTextEditor?.document.getText().toString();
		let textDoxSplited = textDoc?.trim().split('\r\n').toString();
		let str = "";
		var i = 0;
		while (textDoxSplited.includes(";,")) {
			textDoxSplited = textDoxSplited.replace(";,", ";");
		}
		while (textDoxSplited.includes("},")) {
			textDoxSplited = textDoxSplited.replace("},", "}");
		}
		while (textDoxSplited.includes("{,")) {
			textDoxSplited = textDoxSplited.replace("{,", "{");
		}
		while (textDoxSplited.includes(",,")) {
			textDoxSplited = textDoxSplited.replace(",,", ",");
		}
		while (textDoxSplited.includes("),")) {
			textDoxSplited = textDoxSplited.replace("),", ")");
		}
		let textLast = textDoxSplited.split("';");
		if (textLast[i].split(" ")[0] == 'import') {
			do {
				str += textLast[i] + "'; \n";
				i++
			}
			while (textLast[i].split(" ")[0] == 'import');
		}
		let documentName = [];
		if (vscode.window.activeTextEditor?.document.fileName.includes("\\")) {
			vscode.window.activeTextEditor?.document.fileName.split("\\");
		}
		if (vscode.window.activeTextEditor?.document.fileName.includes("/")) {
			vscode.window.activeTextEditor?.document.fileName.split("/");
		}
		documentName = vscode.window.activeTextEditor?.document.fileName.split("\\");
		let documentNameEdited = documentName[documentName.length - 1].replace(".dart", "");
		str += "import 'package:mobkit_generator/annotations.dart';\n";
		str += "part '" + documentNameEdited + ".g.dart';\n";
		let enumList = textLast[textLast.length - 1].split("enum ");
		for (var k = 1; k < enumList.length; k++) {
			if (typeAnswer.label == "string" && descriptionAnswer.label == 'Yes') {
				str += "@EnumSerializable(String, true)\n";
			}
			else if (typeAnswer.label == "string" && descriptionAnswer.label == 'No') {
				str += "@EnumSerializable(String, false)\n";
			}
			else if (typeAnswer.label == "int" && descriptionAnswer.label == 'Yes') {
				str += "@EnumSerializable(int, true)\n";
			}
			else if (typeAnswer.label == "int" && descriptionAnswer.label == 'No') {
				str += "@EnumSerializable(int, false)\n";
			}
			str += "enum " + enumList[k].split("{")[0] + "{\n";
			let enumValue = enumList[k].split("{")[1].split(',');
			for (var z = 0; z < enumValue.length; z++) {
				if (enumValue[z].toString() != "}" && enumValue[z].toString() != "{" && enumValue[z].toString() != "  ") {
					if (descriptionAnswer.label == "Yes") {
						if (typeAnswer.label == "string") {
							str += "	@EnumValue({'0',''})\n";
							if (z == enumValue.length - 1) {
								str += enumValue[z] + "\n";
							} else {
								str += enumValue[z] + ",\n";
							}
						}
						else if (typeAnswer.label == "int") {
							str += "	@EnumValue({0,''})\n";
							if (z == enumValue.length - 1) {
								str += enumValue[z] + "\n";
							}
							else {
								str += enumValue[z] + ",\n";
							}
						}
					}
					else {
						if (typeAnswer.label == "string") {
							str += "	@EnumValue('0')\n";
							if (z == enumValue.length - 1) {
								str += enumValue[z] + "\n";
							} else {
								str += enumValue[z] + ",\n";
							}
						}
						else if (typeAnswer.label == "int") {
							str += "	@EnumValue(0)\n";
							if (z == enumValue.length - 1) {
								str += enumValue[z] + "\n";
							}
							else {
								str += enumValue[z] + ",\n";
							}
						}
					}

				}
			}
			if (str[str.length - 2] != "}") {
				str += "}";
			}
		}
		await vscode.commands.executeCommand('editor.action.selectAll');
		await vscode.commands.executeCommand('editor.action.clipboardCutAction');
		const editor = vscode.window.activeTextEditor;
		await editor.edit(async editBuilder => {
			editBuilder.insert(new vscode.Position(0, 0), str);
		});
	});
	let runCommand = vscode.commands.registerCommand('biscozum.buildrunner', async function () {
		const terminal = vscode.window.activeTerminal;
		terminal.sendText("flutter packages pub run build_runner build --delete-conflicting-outputs \n");
	});
	context.subscriptions.push(setTextData);
	context.subscriptions.push(runCommand);
}

module.exports = {
	activate,
}
