export * from './content/types.js';
export * from './content/parser.js';
export * from './content/processor.js';
export * from './config/loader.js';
export * from './generators/nextra.js';
export * from './generators/exports.js';
export * from './utils/filesystem.js';
export * from './utils/slug.js';
export * from './utils/routing.js';
import { loadConfig } from './config/loader.js';
import { ContentProcessor } from './content/processor.js';
import { NextraGenerator } from './generators/nextra.js';
import { ExportsGenerator } from './generators/exports.js';
export async function build(configPath) {
    try {
        console.log('🏗️  Starting EZ Docs build...');
        // Load configuration
        const config = await loadConfig(configPath);
        console.log(`📝 Loaded configuration: ${config.name}`);
        // Process content
        const processor = new ContentProcessor(config);
        const contentIndex = await processor.process();
        // Generate Nextra structure
        const nextraGenerator = new NextraGenerator(config);
        await nextraGenerator.generate(contentIndex);
        // Generate exports
        const exportsGenerator = new ExportsGenerator(config);
        await exportsGenerator.generate(contentIndex);
        console.log('🎉 Build completed successfully!');
        console.log(`   📊 Processed ${contentIndex.metadata.totalItems} items`);
        console.log(`   📁 Generated ${contentIndex.metadata.totalCollections} collections`);
    }
    catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}
export async function validate(configPath) {
    try {
        console.log('🔍 Validating content...');
        // Load configuration
        const config = await loadConfig(configPath);
        console.log(`📝 Configuration loaded: ${config.name}`);
        // Process content (includes validation)
        const processor = new ContentProcessor(config);
        await processor.process();
        console.log('✅ Content validation completed successfully!');
        return true;
    }
    catch (error) {
        console.error('❌ Validation failed:', error);
        return false;
    }
}
//# sourceMappingURL=index.js.map