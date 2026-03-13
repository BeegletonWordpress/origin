import { registerBlockType } from '@wordpress/blocks';
import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	PanelColorSettings,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import metadata from './block.json';

const UnderlineSVG = ( { spacing, color } ) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		version="1.1"
		viewBox="0 0 472.7 31.5"
		className="absolute left-0 w-full h-10 pointer-events-none"
		style={ {
			bottom: `-${ spacing }rem`,
			color: color || 'inherit',
		} }
		preserveAspectRatio="none"
	>
		<path
			fill="currentColor"
			d="M3,2.3c27.3-.2,133.6.1,160.9.5,27.3.4,54.6.9,81.9,1.1,27.3.2,54.6.4,81.9.6,13.8.1,27.6.2,41.5.3,12.1.1,24.4.4,36.5.3,9.9,0,19.7-.4,29.6-.3,9.5,0,19.4.2,28.5,1.5,1.9.3,3.5.6,5.2,1l.6-2c-13.2,1.8-27,2.7-40.7,3.4-13.7.6-28.8,1-43.1,1.4s-29.1,1-43.7,1.4c-17.5.5-35,.7-52.5.8-17.4.1-34.9.1-52.3.2-17.5,0-35,.2-52.5.6-17.5.4-34.2,1-51.2,1.8-13.1.6-26.3,1-39.5,1.3-12.2.3-24.4.4-36.6.6-14.2.2-28.3.5-42.5.9-4.2.1-8.3.3-12.4.4-2.4,0-3.5,1.5-1.3,2.1,10.2,2.9,22.1,4.4,34,5.2,13.1.9,26.3,1.1,39.4,1.1,12.4,0,24.8-.2,37.2,0,6.8,0,13.6.3,20.5.5,8.7.2,17.4.4,26.1.4,17.3.2,34.6.1,51.9,0,17.4,0,34.8-.2,52.1-.3,17.3,0,34.6,0,51.9.4,8.8.2,17.7,0,26.5,0,11.1-.1,22.3-.2,33.4.2,5.2.2,10,.4,15.1.9,2.3.2,4.5.4,6.8.7s3.9.6,5.6.9c.8.2,1.6.4,2.4.6.4,0,.7.2,1.1.3.2,0,.4.1.6.2.5.1-.1,0,.2,0,1.1.4,2.5.5,3.5,0,.9-.4,1.1-1.2,0-1.6-7.1-2.5-16.6-3.4-25.4-3.9-11.1-.7-22.3-.8-33.4-.7-9.7,0-19.4.2-29.1.2-5.9,0-11.9-.2-17.8-.2-8.7-.1-17.4-.2-26.1-.2-17.3,0-34.6,0-51.9.2-17.4.1-34.8.2-52.1.2-17.4,0-34.8-.3-52.1-.9-11.8-.4-23.7-.2-35.6-.2-13.1,0-26.3.1-39.4-.4-12-.5-24.3-1.4-35.4-3.7-2.5-.5-5-1.1-7.4-1.8l-1.3,2.1c15.2-.5,30.3-.9,45.5-1.2,12.4-.2,24.8-.4,37.2-.6,12.7-.2,25.4-.5,38.1-1,16.3-.6,32.6-1.5,49-2,17.5-.5,35-.7,52.5-.8,17.5-.1,35-.1,52.5-.2,17.5,0,35-.2,52.5-.6,15.6-.3,31.1-1,46.6-1.4,14.1-.4,28.3-.7,42.4-1.2,14.3-.5,28.7-1.3,42.6-2.7,3.1-.3,6.3-.7,9.3-1.1,2-.3,2.6-1.6.6-2-8.3-1.9-18-2.5-27.3-2.7-10.2-.2-20.5,0-30.7.1-11,.2-22,0-33,0-13.7-.1-27.5-.2-41.2-.3-27.6-.2-55.3-.4-82.9-.6-27.3-.2-54.6-.6-82-1C146.9.3,40.4,0,12.9,0c-3.3,0-6.6,0-9.9,0S-.2,2.3,3,2.3h0Z"
		/>
	</svg>
);

registerBlockType( metadata.name, {
	edit: function Edit( { attributes, setAttributes } ) {
		const { underlineSpacing, svgColor, minWidth } = attributes;

		const blockProps = useBlockProps( {
			style: {
				marginBottom: `${ underlineSpacing }rem`,
			},
		} );

		const { children, ...innerBlocksProps } = useInnerBlocksProps(
			{
				className: 'relative inline-block w-auto',
				style: {
					minWidth: `${ minWidth }px`,
				},
			},
			{
				allowedBlocks: [ 'core/heading' ],
				template: [
					[
						'core/heading',
						{
							level: 2,
							placeholder: 'Add a header...',
							className: 'inline-block',
						},
					],
				],
				templateLock: 'all',
			}
		);

		return (
			<>
				<InspectorControls>
					<PanelBody title="Underline Settings">
						<RangeControl
							label="Underline Spacing (rem)"
							value={ underlineSpacing }
							onChange={ ( value ) =>
								setAttributes( { underlineSpacing: value } )
							}
							min={ 0 }
							max={ 10 }
							step={ 0.1 }
						/>
						<RangeControl
							label="Minimum Underline Width (px)"
							value={ minWidth }
							onChange={ ( value ) =>
								setAttributes( { minWidth: value } )
							}
							min={ 50 }
							max={ 1000 }
							step={ 1 }
						/>
					</PanelBody>
					<PanelColorSettings
						title="SVG Color"
						colorSettings={ [
							{
								value: svgColor,
								onChange: ( value ) =>
									setAttributes( { svgColor: value } ),
								label: 'Underline SVG Color',
							},
						] }
					/>
				</InspectorControls>
				<div { ...blockProps }>
					<div { ...innerBlocksProps }>
						{ children }
						<UnderlineSVG
							spacing={ underlineSpacing }
							color={ svgColor }
						/>
					</div>
				</div>
			</>
		);
	},
	save: function Save( { attributes } ) {
		const { underlineSpacing, svgColor, minWidth } = attributes;

		const blockProps = useBlockProps.save( {
			style: {
				marginBottom: `${ underlineSpacing }rem`,
			},
		} );

		return (
			<div { ...blockProps }>
				<div
					className="relative inline-block w-auto"
					style={ { minWidth: `${ minWidth }px` } }
				>
					<InnerBlocks.Content />
					<UnderlineSVG
						spacing={ underlineSpacing }
						color={ svgColor }
					/>
				</div>
			</div>
		);
	},
} );
