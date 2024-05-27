import {
    Player,
    ItemStack,
    world,
    EntityInventoryComponent,
    EntityEquippableComponent,
    system,
    EquipmentSlot
}
    from '@minecraft/server';
import { ActionFormData, ActionFormResponse } from '@minecraft/server-ui'

class Kit {
    armour: string[]
    items: [string, number][]
    constructor(armour: string[], items: [string, number][]) {
        this.items = items;
        this.armour = armour
    }
}

class StarterKitForm extends ActionFormData {
    kits: Kit[] = []
    addKit(identifier: string, armour: string[], items: [string, number][]): void {
        this.kits.push(new Kit(armour, items))
        this.button(identifier)
    }

    constructor() {
        super()
        this.title("Select a starter kit!");
    }
}


function createForm(): StarterKitForm {
    const form = new StarterKitForm()

    form.addKit("The survivalist",
        ["minecraft:leather_helmet",
            "minecraft:leather_chestplate",
            "minecraft:leather_leggings",
            "minecraft:leather_boots"
        ],
        [
            ["minecraft:wooden_pickaxe", 1],
            ["minecraft:wooden_shovel", 1],
            ["minecraft:wooden_axe", 1],
            ["minecraft:wooden_sword", 1],
            ["minecraft:bread", 16],
            ["minecraft:crafting_table", 1],
            ["minecraft:torch", 8]

        ])

    form.addKit("The explorer",
        ["minecraft:leather_helmet",
            "minecraft:leather_chestplate",
            "minecraft:leather_leggings",
            "minecraft:leather_boots"
        ],
        [
            ["minecraft:stone_pickaxe", 1],
            ["minecraft:stone_shovel", 1],
            ["minecraft:stone_axe", 1],
            ["minecraft:stone_sword", 1],
            ["minecraft:cooked_porkchop", 32],
            ["minecraft:compass", 1],
            ["minecraft:locator_map", 1]
        ])

    form.addKit("The builder",
        ["minecraft:leather_helmet",
            "minecraft:leather_chestplate",
            "minecraft:leather_leggings",
            "minecraft:leather_boots"],
        [
            ["minecraft:stone_pickaxe", 1],
            ["minecraft:stone_axe", 1],
            ["minecraft:stone_shovel", 1],
            ["minecraft:stone_hoe", 1],
            ["minecraft:oak_log", 64],
            ["minecraft:crafting_table", 1],
            ["minecraft:torch", 16]
        ])

    return form
}

function requestAndGiveKit(player: Player) {
    var form = createForm();
    form.show(player).then((response) => {
        if (response.canceled) return requestAndGiveKit(player)
        const inv = player.getComponent('minecraft:inventory') as EntityInventoryComponent
        const equipment = player.getComponent('minecraft:equippable') as EntityEquippableComponent
        var kit = form.kits[response.selection];
        equipment.setEquipment(EquipmentSlot.Head, new ItemStack(kit.armour[0]))
        equipment.setEquipment(EquipmentSlot.Chest, new ItemStack(kit.armour[1]))
        equipment.setEquipment(EquipmentSlot.Legs, new ItemStack(kit.armour[2]))
        equipment.setEquipment(EquipmentSlot.Feet, new ItemStack(kit.armour[3]))
        for (const [name, amount] of kit.items) {
            const item = new ItemStack(name, amount)
            inv.container.addItem(item)
        }
    })
}

world.afterEvents.playerSpawn.subscribe(event => {
    var player = event.player
    requestAndGiveKit(player)
})
