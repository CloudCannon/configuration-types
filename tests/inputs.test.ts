import { describe, expect, it } from 'vitest';
import { BaseInputSchema } from '../src/inputs';

describe('BaseInputSchema', () => {
	it('should accept a text input', () => {
		const input = {
			type: 'text',
			comment: 'Enter your name',
			label: 'Full Name',
			required: true,
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it('should accept a textarea input', () => {
		const input = {
			type: 'textarea',
			comment: 'Enter description',
			options: {
				rows: 5,
				cols: 40,
			},
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it('should accept an email input', () => {
		const input = {
			type: 'email',
			comment: 'Enter your email address',
			placeholder: 'user@example.com',
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it('should accept a number input', () => {
		const input = {
			type: 'number',
			comment: 'Enter your age',
			options: {
				min: 0,
				max: 150,
				step: 1,
			},
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it('should accept a range input', () => {
		const input = {
			type: 'range',
			comment: 'Select a value',
			options: {
				min: 0,
				max: 100,
				step: 5,
			},
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it('should accept a checkbox input', () => {
		const input = {
			type: 'checkbox',
			comment: 'Enable notifications',
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it('should accept a switch input', () => {
		const input = {
			type: 'switch',
			comment: 'Toggle dark mode',
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it('should accept a select input', () => {
		const input = {
			type: 'select',
			comment: 'Choose your country',
			options: {
				values: ['US', 'CA', 'UK', 'AU'],
			},
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it('should accept a multiselect input', () => {
		const input = {
			type: 'multiselect',
			comment: 'Select your interests',
			options: {
				values: ['coding', 'design', 'marketing', 'sales'],
			},
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it('should accept a choice input', () => {
		const input = {
			type: 'choice',
			comment: 'Select your plan',
			options: {
				values: [
					{ label: 'Free', value: 'free' },
					{ label: 'Pro', value: 'pro' },
					{ label: 'Enterprise', value: 'enterprise' },
				],
			},
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it('should accept a multichoice input', () => {
		const input = {
			type: 'multichoice',
			comment: 'Select features',
			options: {
				values: [
					{ label: 'Analytics', value: 'analytics' },
					{ label: 'Support', value: 'support' },
					{ label: 'Custom Domain', value: 'custom_domain' },
				],
			},
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it('should accept a date input', () => {
		const input = {
			type: 'date',
			comment: 'Select a date',
			options: {
				format: 'YYYY-MM-DD',
			},
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it('should accept a datetime input', () => {
		const input = {
			type: 'datetime',
			comment: 'Select date and time',
			options: {
				format: 'YYYY-MM-DD HH:mm:ss',
			},
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it('should accept a time input', () => {
		const input = {
			type: 'time',
			comment: 'Select a time',
			options: {
				format: 'HH:mm',
			},
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it('should accept a file input', () => {
		const input = {
			type: 'file',
			comment: 'Upload a document',
			options: {
				accepts_mime_types: ['application/pdf', 'text/plain'],
			},
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it('should accept an image input', () => {
		const input = {
			type: 'image',
			comment: 'Upload an image',
			options: {
				width: 800,
				height: 600,
				resize_style: 'contain' as const,
			},
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it('should accept a document input', () => {
		const input = {
			type: 'document',
			comment: 'Select a document',
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it('should accept a url input', () => {
		const input = {
			type: 'url',
			comment: 'Enter a website URL',
			placeholder: 'https://example.com',
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it('should accept an object input', () => {
		const input = {
			type: 'object',
			comment: 'Configure settings',
			options: {
				structures: ['_structures.settings'],
			},
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it('should accept an array input', () => {
		const input = {
			type: 'array',
			comment: 'Add items',
			options: {
				structures: ['_structures.item'],
			},
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it('should accept a code input', () => {
		const input = {
			type: 'code',
			comment: 'Enter code',
			options: {
				language: 'javascript',
				theme: 'github',
			},
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it('should accept a rich_text input', () => {
		const input = {
			type: 'rich_text',
			comment: 'Enter rich text content',
			options: {
				bold: true,
				italic: true,
				link: true,
			},
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it('should accept a color input', () => {
		const input = {
			type: 'color',
			comment: 'Choose a color',
			options: {
				format: 'hex' as const,
				alpha: false,
			},
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it('should accept a hidden input', () => {
		const input = {
			type: 'hidden',
			comment: 'Hidden field',
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it('should accept input without type field', () => {
		const input = {
			comment: 'This should pass since type is not required in BaseInputSchema',
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it('should accept input with cascade options', () => {
		const input = {
			type: 'text',
			comment: 'Text with cascade',
			cascade: true,
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it('should accept input with context', () => {
		const input = {
			type: 'text',
			comment: 'Text with context',
			context: {
				open: true,
				title: 'Help',
				icon: 'help',
				content: 'This is help text',
			},
		};

		const result = BaseInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});
});
