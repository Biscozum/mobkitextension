# MobkitExtension

MobkitExtension is code generation tool that creates functions to help you code Flutter. It allows you to get the values ​​you give to your enums. Flutter currently does not support this functionality.

# Usage

It was created to facilitate the use of the mobkit_generator package published on pub.dev for Flutter.

If you've already added annotations like `@JsonValue` to your enums, you don't need to use this extension. You can just use the `build runner` function.

# Installation

To install the extension just execute the following command:

 `ext install vscode-MobkitExtension`

You may also install the extension from the [ visual studio code marketplace.](https://marketplace.visualstudio.com/)

# Getting started
1. Install the extension
2. Open your project, open the command palette and find the `MobkitExtension Add Annotation` command.
3. Select the data type for the Annotation you want to add.

# Commands

## MobkitExtension: Add Annotation

It creates the appropriate structure for the MobkitExtension by adding the `@EnumSerializable` and `@EnumValue` annotations.

## MobkitExtension: Build Runner

Type the necessary command to the terminal to run the MobkitGenerator plugin.