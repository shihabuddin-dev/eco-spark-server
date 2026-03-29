import { prisma } from "./src/app/lib/prisma";

const cleanup = async () => {
    const ideas = await prisma.idea.findMany({ select: { id: true, title: true } });
    const titles = [
        "Smart Solar Window Blinds",
        "Community Compost Network App",
        "Hydrogen Cargo Bike Fleet",
        "IoT Greywater Recycling System",
        "Vertical Hydroponic Farm Modules",
        "Micro-Wind Streetlight Turbines",
        "Mushroom-Based Biodegradable Packaging",
        "Electric School Bus V2G Network",
        "Ocean Plastic Drone Collector",
        "Precision Regenerative Grazing AI",
        "Algae-Based Air Purification Towers",
        "Blockchain Wood Salvage Marketplace",
        "Solar-Powered Desalination Units",
        "Plastic-Free Toothpaste Tablets",
        "Bamboo-Based Bicycle Frames",
        "AI-Driven Crop Pest Detection",
        "Thermal Energy Storage Bricks"
    ];

    const toDelete = ideas.filter(i => !titles.includes(i.title)).map(i => i.id);

    if (toDelete.length > 0) {
        // Need to delete dependencies first if there are some
        await prisma.vote.deleteMany({ where: { ideaId: { in: toDelete } } });
        await prisma.comment.deleteMany({ where: { ideaId: { in: toDelete } } });
        await prisma.payment.deleteMany({ where: { ideaId: { in: toDelete } } });
        await prisma.idea.deleteMany({ where: { id: { in: toDelete } } });
        console.log(`🗑️ Cleaned up ${toDelete.length} old/duplicate ideas.`);
    } else {
        console.log("✨ No cleanup needed.");
    }
}

cleanup().finally(() => prisma.$disconnect());
