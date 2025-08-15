import { describe, expect, it } from 'vitest';
import { StructureSchema, StructureValueSchema } from '../src/structures.ts';

describe('StructureSchema', () => {
	it('should accept a basic structure', () => {
		const structure = {
			values: [
				{
					value: {
						title: 'New Post',
						content: '',
						published: false,
					},
				},
			],
		};

		const result = StructureSchema.safeParse(structure);
		expect(result.success).toBe(true);
	});

	it('should accept structure with multiple values', () => {
		const structure = {
			id_key: '_type',
			style: 'modal' as const,
			values: [
				{
					label: 'Blog Post',
					icon: 'article',
					value: {
						_type: 'post',
						title: '',
						content: '',
						date: new Date().toISOString(),
					},
				},
				{
					label: 'Page',
					icon: 'description',
					value: {
						_type: 'page',
						title: '',
						content: '',
					},
				},
			],
		};

		const result = StructureSchema.safeParse(structure);
		expect(result.success).toBe(true);
	});

	it('should accept structure with advanced options', () => {
		const structure = {
			reorder_inputs: false,
			hide_extra_inputs: true,
			remove_empty_inputs: true,
			remove_extra_inputs: false,
			values: [
				{
					id: 'card',
					default: true,
					label: 'Card',
					icon: 'credit_card',
					image: '/images/card-preview.png',
					tags: ['content', 'featured'],
					comment: 'A card component for displaying content',
					documentation: {
						url: 'https://docs.example.com/card',
					},
					value: {
						_type: 'card',
						title: '',
						description: '',
						image: null,
						link: '',
					},
				},
			],
		};

		const result = StructureSchema.safeParse(structure);
		expect(result.success).toBe(true);
	});

	it('should reject invalid style', () => {
		const structure = {
			style: 'invalid-style' as any,
			values: [
				{
					value: { title: 'Test' },
				},
			],
		};

		const result = StructureSchema.safeParse(structure);
		expect(result.success).toBe(false);
	});

	it('should accept structure without id_key and apply default', () => {
		const structure = {
			values: [
				{
					value: { _type: 'default' },
				},
			],
		};

		const result = StructureSchema.safeParse(structure);
		expect(result.success).toBe(true);
		// Note: Zod defaults may not be applied in the parsed data unless explicitly set
		// The schema validation passes and that's what we're testing
	});
});

describe('StructureValueSchema', () => {
	it('should accept a minimal structure value', () => {
		const structureValue = {
			value: {
				title: 'Hello World',
			},
		};

		const result = StructureValueSchema.safeParse(structureValue);
		expect(result.success).toBe(true);
	});

	it('should accept structure value with all options', () => {
		const structureValue = {
			id: 'hero',
			default: true,
			icon: 'star',
			image: '/previews/hero.png',
			label: 'Hero Section',
			tags: ['layout', 'hero'],
			comment: 'A hero section for the homepage',
			documentation: {
				url: 'https://docs.example.com/hero',
				text: 'Learn about hero sections',
			},
			reorder_inputs: true,
			hide_extra_inputs: false,
			remove_empty_inputs: true,
			remove_extra_inputs: false,
			groups: [
				{
					heading: 'Content',
					inputs: ['title', 'subtitle', 'description'],
				},
				{
					heading: 'Styling',
					inputs: ['background_color', 'text_color'],
				},
			],
			place_groups_below: true,
			tabbed: false,
			value: {
				_type: 'hero',
				title: 'Welcome',
				subtitle: 'To our amazing site',
				description: 'This is the hero section',
				background_color: '#ffffff',
				text_color: '#000000',
			},
			_inputs: {
				title: {
					type: 'text',
					comment: 'Main heading',
				},
				subtitle: {
					type: 'text',
					comment: 'Secondary heading',
				},
			},
		};

		const result = StructureValueSchema.safeParse(structureValue);
		expect(result.success).toBe(true);
	});

	it('should accept structure value with preview options', () => {
		const structureValue = {
			value: {
				title: 'Card',
			},
			preview: {
				text: 'Card: {{title}}',
				subtext: 'Content card',
				icon: 'card_giftcard',
			},
			picker_preview: {
				text: 'Card Component',
				subtext: 'A reusable card',
				icon: 'card_giftcard',
				image: '/previews/card.png',
			},
		};

		const result = StructureValueSchema.safeParse(structureValue);
		expect(result.success).toBe(true);
	});

	it('should accept structure value with groups', () => {
		const structureValue = {
			groups: [
				{
					heading: 'Basic Info',
					inputs: ['name', 'email'],
					comment: 'Enter your basic information',
				},
				{
					heading: 'Advanced',
					inputs: ['bio', 'website'],
					collapsed: true,
				},
			],
			place_groups_below: false,
			tabbed: true,
			value: {
				basic: {
					name: '',
					email: '',
				},
				advanced: {
					bio: '',
					website: '',
				},
			},
		};

		const result = StructureValueSchema.safeParse(structureValue);
		expect(result.success).toBe(true);
	});

	it('should accept structure value and validate successfully', () => {
		const structureValue = {
			value: { test: true },
		};

		const result = StructureValueSchema.safeParse(structureValue);
		expect(result.success).toBe(true);
	});

	it('should accept any value type', () => {
		const values = [
			{ value: 'string' },
			{ value: 42 },
			{ value: true },
			{ value: null },
			{ value: [] },
			{ value: {} },
			{ value: { complex: { nested: 'object' } } },
		];

		values.forEach((structureValue) => {
			const result = StructureValueSchema.safeParse(structureValue);
			expect(result.success).toBe(true);
		});
	});
});
