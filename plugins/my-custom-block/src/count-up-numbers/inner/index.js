import { registerBlockType } from '@wordpress/blocks';
import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import metadata from './block.json';
import '../../index.css';
import './style.css';
import './editor.css';

const ALLOWED_BLOCKS = [ 'create-block/my-count-up-numbers-item' ];
const TEMPLATE = [
	[ 'create-block/my-count-up-numbers-item' ],
	[ 'create-block/my-count-up-numbers-item' ],
	[ 'create-block/my-count-up-numbers-item' ],
];

registerBlockType( metadata.name, {
	edit: function Edit() {
		const blockProps = useBlockProps( {
			className:
				'count-up-numbers-inner is-layout-constrained wp-block-my-custom-block-count-up-numbers-inner-is-layout-constrained',
		} );
		const innerBlocksProps = useInnerBlocksProps(
			{
				className: 'flex justify-evenly w-full gap-8 flex-wrap',
			},
			{
				allowedBlocks: ALLOWED_BLOCKS,
				template: TEMPLATE,
			}
		);
		return <div { ...blockProps }>{ innerBlocksProps.children }</div>;
	},
	save: function Save() {
		const blockProps = useBlockProps.save( {
			className:
				'count-up-numbers-inner is-layout-constrained wp-block-my-custom-block-count-up-numbers-inner-is-layout-constrained',
		} );
		return (
			<div { ...blockProps }>
				<div className="flex justify-evenly w-full gap-8 flex-wrap">
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
} );
