const { IframeTab, addTab, getCurrentTabSystem } = await require('@bridge/tab')
const { create } = await require('@bridge/sidebar')
const { register, addTabActions, registerPreview } = await require('@bridge/tab-actions')
const { openExternal } = await require('@bridge/utils')
const { registerOpenWithHandler } = await require('@bridge/import')

class MCBEEStructureLootEditorTab extends IframeTab {
	type = 'MCBEEStructureLootEditorTab'

	async setup() {
		addTabActions(this)

		await super.setup()
	}

	async is(tab) {
		const canBeSameTab = await super.is(tab)
		if (!canBeSameTab) return false
	  
		const referencedFile = this.getOptions().openWithPayload?.filePath
		const referencesSameFile = referencedFile === tab.getOptions().openWithPayload?.filePath
	  
		return referencedFile !== undefined && referencesSameFile
	}

	get icon() {
		return 'mdi-bottle-tonic-skull-outline'
	}
	get iconColor() {
		return 'primary'
	}
	get name() {
		return 'Loot Tabler'
	}
}

async function createTab(tabSystem, fileHandle, filePath) {
	const tab = new MCBEEStructureLootEditorTab(tabSystem, {
		url: 'https://mcbe-essentials.glitch.me/structure-editor/loot-tabler/',
		openWithPayload: {filePath, fileHandle}
	}) 
	return tab;
}

register({
	icon: 'mdi-open-in-new',
	name: '[Open New]',
	trigger() {
		openExternal('https://mcbe-essentials.glitch.me/structure-editor/loot-tabler/')
	},
	isFor(tab) {
		return tab.type === 'MCBEEStructureLootEditorTab'
	},
})

registerOpenWithHandler({
	icon: 'mdi-bottle-tonic-skull-outline',
	name: '[Loot Tabler]',
	isAvailable: ({ filePath }) => filePath && filePath.includes("BP/structures"),
	onOpen: async ({ fileHandle, filePath }) => {
		const tab = await createTab(
			await getCurrentTabSystem(),
			fileHandle,
			filePath
		)

		addTab(tab)
	},
})