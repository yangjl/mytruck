import { db } from "./index";
import { inventoryItems } from "./schema";

async function seedInventory() {
  console.log("Seeding inventory items...");

  const items = [
    // Tires & Chassis Components
    {
      name: "Tires (11R22.5)",
      category: "Tires & Chassis",
      unit: "each",
      quantity: 12,
      minQuantity: 4,
      location: "Warehouse A",
    },
    {
      name: "Mud Flaps",
      category: "Tires & Chassis",
      unit: "each",
      quantity: 6,
      minQuantity: 2,
      location: "Warehouse A",
    },
    {
      name: "Wheel Lug Nuts",
      category: "Tires & Chassis",
      unit: "each",
      quantity: 80,
      minQuantity: 20,
      location: "Shelf B3",
    },
    // Maintenance Consumables
    {
      name: "Oil Filters",
      category: "Maintenance Consumables",
      unit: "each",
      quantity: 25,
      minQuantity: 10,
      location: "Shelf C1",
    },
    {
      name: "Air Filters",
      category: "Maintenance Consumables",
      unit: "each",
      quantity: 14,
      minQuantity: 6,
      location: "Shelf C2",
    },
    {
      name: "Fuel Filters",
      category: "Maintenance Consumables",
      unit: "each",
      quantity: 18,
      minQuantity: 8,
      location: "Shelf C3",
    },
    {
      name: "Brake Pads",
      category: "Maintenance Consumables",
      unit: "set",
      quantity: 10,
      minQuantity: 4,
      location: "Shelf D1",
    },
    // Fluids & Liquids
    {
      name: "Engine Oil (20L Drum)",
      category: "Fluids & Liquids",
      unit: "drum",
      quantity: 8,
      minQuantity: 3,
      location: "Storage Area 1",
    },
    {
      name: "Coolant",
      category: "Fluids & Liquids",
      unit: "drum",
      quantity: 5,
      minQuantity: 2,
      location: "Storage Area 1",
    },
    {
      name: "Windshield Washer Fluid",
      category: "Fluids & Liquids",
      unit: "drum",
      quantity: 6,
      minQuantity: 2,
      location: "Storage Area 1",
    },
    // Cleaning & Daily Use
    {
      name: "Car Wash Detergent",
      category: "Cleaning & Daily Use",
      unit: "drum",
      quantity: 4,
      minQuantity: 1,
      location: "Janitorial Closet",
    },
    {
      name: "Cleaning Rags",
      category: "Cleaning & Daily Use",
      unit: "pack",
      quantity: 10,
      minQuantity: 3,
      location: "Janitorial Closet",
    },
  ];

  for (const item of items) {
    await db.insert(inventoryItems).values(item);
  }

  console.log("Inventory seeding completed.");
}

seedInventory()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
