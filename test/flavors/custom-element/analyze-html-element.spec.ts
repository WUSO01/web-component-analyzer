import { analyzeHTMLElement } from "../../../src/analyze/analyze-html-element";
import { getExtendsForInheritanceTree } from "../../../src/analyze/util/inheritance-tree-util";
import { getCurrentTsModule, getCurrentTsModuleDirectory, tsTest } from "../../helpers/ts-test";
import { getComponentProp } from "../../helpers/util";

tsTest("analyzeHTMLElement returns correct result", t => {
	const tsModule = getCurrentTsModule();
	const program = tsModule.createProgram([`${getCurrentTsModuleDirectory()}/lib.dom.d.ts`], {});
	const result = analyzeHTMLElement(program, tsModule);

	t.truthy(result);

	const ext = getExtendsForInheritanceTree(result!.inheritanceTree);

	// Test that the node extends some of the interfaces
	t.truthy(ext.has("EventTarget"));
	t.truthy(ext.has("Node"));
	t.truthy(ext.has("DocumentAndElementEventHandlers"));
	t.truthy(ext.has("ElementContentEditable"));

	// From ElementContentEditable interface
	t.truthy(getComponentProp(result!.members, "contentEditable"));
	// From Node interface
	t.truthy(getComponentProp(result!.members, "baseURI"));
	// From EventTarget interface
	t.truthy(result!.methods.find(m => m.name === "addEventListener"));
});
