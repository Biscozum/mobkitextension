const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
	console.log('Congratulations, your extension "MobkitGenerator" is now active!');

	let setTextData = vscode.commands.registerCommand('biscozum.addAnnotation', async function () {
		let typeAnswer;
		let descriptionAnswer;
		let annotationAnswer;
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
			{ placeHolder: 'You have to specify if you want to get annotation with enums.' });
		if (descriptionAnswer == null) {
			await vscode.window.showInformationMessage("You have to specify if you want to get annotation with enums");
			return;
		}
		annotationAnswer = await vscode.window.showQuickPick(
			[
				{ label: 'EnumValue', description: 'EnumValue', detail: "EnumValue will be added as annotation to your Enum." },
				{ label: 'JsonValue', description: 'JsonValue', detail: "JsonValue will be added as annotation to your Enum." }
			],
			{ placeHolder: 'You have to decide which annotation to add.' });
		if (annotationAnswer == null) {
			await vscode.window.showInformationMessage("You have to decide which annotation to add.");
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
		str += "import 'package:mobkit_enum_generator/annotations.dart';\n";
		str += "part '" + documentNameEdited + ".g.dart';\n";
		let enumList = textLast[textLast.length - 1].split("enum ");
		for (var k = 1; k < enumList.length; k++) {
			if (typeAnswer.label == "string") {
				if (descriptionAnswer.label == 'Yes') {
					str += "@EnumSerializable(String, [])\n";
				}
				else {
					str += "@EnumSerializable(String, null)\n";
				}
			}
			else if (typeAnswer.label == "int") {
				if (descriptionAnswer.label == 'Yes') {
					str += "@EnumSerializable(int, [])\n";
				}
				else {
					str += "@EnumSerializable(int, null)\n";
				}
			}
			str += "enum " + enumList[k].split("{")[0] + "{\n";
			let enumValue = enumList[k].split("{")[1].split(',');
			let index = 0;
			for (var z = 0; z < enumValue.length; z++) {
				if (enumValue[z].toString() != "}" && enumValue[z].toString() != "{" && enumValue[z].toString() != "  ") {
					index++;
					if (typeAnswer.label == "string") {
						if (annotationAnswer.label == "EnumValue") {
							str += "	@EnumValue('" + index + "')\n";
						}
						else if (annotationAnswer.label == "JsonValue") {
							str += "	@JsonValue('" + index + "')\n";
						}
						if (z == enumValue.length - 1) {
							str += enumValue[z] + "\n";
						} else {
							str += enumValue[z] + ",\n";
						}
					}
					else if (typeAnswer.label == "int") {
						if (annotationAnswer.label == "EnumValue") {
							str += "	@EnumValue(" + index + ")\n";
						}
						else if (annotationAnswer.label == "JsonValue") {
							str += "	@JsonValue(" + index + ")\n";
						}
						if (z == enumValue.length - 1) {
							str += enumValue[z] + "\n";
						}
						else {
							str += enumValue[z] + ",\n";
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

	let classToJsonSerializable = vscode.commands.registerCommand('biscozum.classToJsonSerializable', async function () {
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
		} while (textDoxSplited.includes("(,")) {
			textDoxSplited = textDoxSplited.replace("(,", "(");
		}
		let textLast = textDoxSplited.split("';");
		let isJsonImported = false;
		if (textLast[i].split(" ")[0] == 'import') {
			do {

				if (textLast[i].replace("import ", '').replace(/\s/g, '') != "'package:json_annotation/json_annotation.dart") {
					str += textLast[i] + "'; \n";
				} else {
					isJsonImported = true;
				}
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
		if (!isJsonImported) {
			str += "import 'package:json_annotation/json_annotation.dart';\n";
		}
		str += "\n";
		str += "part '" + documentNameEdited + ".g.dart';\n";
		str += "\n";
		str += "@JsonSerializable()\n";
		let className = "";
		let classList = textLast[textLast.length - 1].split("class ");
		if (classList[1].split("{")[0].replace(" ", "").includes("extends")) {
			className = classList[1].split("{")[0].replace(" ", "").split("extends")[0];
		} else {
			className = classList[1].split("{")[0].replace(" ", "");
		}

		for (var k = 1; k < classList.length; k++) {
			str += "class " + classList[k].split("{")[0] + "{\n";
			let classValue = classList[k].split(" { ")[1].split(';');
			let index = 0;
			for (var z = 0; z < classValue.length; z++) {
				if (classValue[z].toString() != "}" && classValue[z].toString() != "{" && classValue[z].toString() != "  " && classValue[z].replace(/\s/g, '').toString() != ",") {
					index++;
					if (z == classValue.length - 1) {
						str += classValue[z] + "\n";
					} else {
						str += classValue[z] + ";\n";
					}
				}
			}
			str += "factory " + className + ".fromJson(Map<String, dynamic> json) => _$" + className + "FromJson(json);\n";
			str += "Map<String,dynamic> toJson() => _$" + className + "ToJson(this);\n";
		}
		str += "}\n";


		// let enumList = textLast[textLast.length - 1].split("enum ");
		// for (var k = 1; k < enumList.length; k++) {
		// 	if (typeAnswer.label == "string" && descriptionAnswer.label == 'Yes') {
		// 		str += "@EnumSerializable(String, [])\n";
		// 	}
		// 	else if (typeAnswer.label == "int" && descriptionAnswer.label == 'Yes') {
		// 		str += "@EnumSerializable(int, [])\n";
		// 	}

		// 	str += "enum " + enumList[k].split("{")[0] + "{\n";
		// 	let enumValue = enumList[k].split("{")[1].split(',');
		// 	let index = 0;
		// 	for (var z = 0; z < enumValue.length; z++) {
		// 		if (enumValue[z].toString() != "}" && enumValue[z].toString() != "{" && enumValue[z].toString() != "  ") {
		// 			index++;
		// 			if (typeAnswer.label == "string") {
		// 				if (annotationAnswer.label == "EnumValue") {
		// 					str += "	@EnumValue('" + index + "')\n";
		// 				}
		// 				else if (annotationAnswer.label == "JsonValue") {
		// 					str += "	@JsonValue('" + index + "')\n";
		// 				}
		// 				if (z == enumValue.length - 1) {
		// 					str += enumValue[z] + "\n";
		// 				} else {
		// 					str += enumValue[z] + ",\n";
		// 				}
		// 			}
		// 			else if (typeAnswer.label == "int") {
		// 				if (annotationAnswer.label == "EnumValue") {
		// 					str += "	@EnumValue(" + index + ")\n";
		// 				}
		// 				else if (annotationAnswer.label == "JsonValue") {
		// 					str += "	@JsonValue(" + index + ")\n";
		// 				}
		// 				if (z == enumValue.length - 1) {
		// 					str += enumValue[z] + "\n";
		// 				}
		// 				else {
		// 					str += enumValue[z] + ",\n";
		// 				}
		// 			}
		// 		}
		// 	}
		// 	if (str[str.length - 2] != "}") {
		// 		str += "}";
		// 	}
		// }
		await vscode.commands.executeCommand('editor.action.selectAll');
		await vscode.commands.executeCommand('editor.action.clipboardCutAction');
		const editor = vscode.window.activeTextEditor;
		await editor.edit(async editBuilder => {
			editBuilder.insert(new vscode.Position(0, 0), str);
		});
	});
	context.subscriptions.push(setTextData);
	context.subscriptions.push(classToJsonSerializable);
	context.subscriptions.push(runCommand);
}



module.exports = {
	activate,
}
