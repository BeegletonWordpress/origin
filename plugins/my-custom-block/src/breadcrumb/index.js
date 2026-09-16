import { registerBlockType } from "@wordpress/blocks";
import { useBlockProps } from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { store as editorStore } from "@wordpress/editor";
import ServerSideRender from "@wordpress/server-side-render";
import metadata from "./block.json";

import "./style.css";

registerBlockType(metadata.name, {
	edit: () => {
		const blockProps = useBlockProps();
		// RankMath's breadcrumb trail is generated from the currently
		// queried post, so the REST render request needs to be told which
		// post that is — otherwise it renders breadcrumbs for whatever the
		// admin request's own context happens to be, not the page being edited.
		const postId = useSelect(
			(select) => select(editorStore).getCurrentPostId(),
			[],
		);
		return (
			<div {...blockProps}>
				<ServerSideRender
					block={metadata.name}
					urlQueryArgs={{ post_id: postId }}
				/>
			</div>
		);
	},
	save: () => null,
});
