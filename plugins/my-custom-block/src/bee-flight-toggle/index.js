/**
 * "Flying bee" switch in the document sidebar of Customer Cases and Posts.
 * Stores the mcb_bee_flight post meta; my-custom-block.php
 * (mcb_bee_flight_post_content) then lets the Bee Flight Container's bee fly
 * through that post's content on the frontend.
 */
import { registerPlugin } from "@wordpress/plugins";
import { PluginDocumentSettingPanel, store as editorStore } from "@wordpress/editor";
import { ToggleControl } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { useEntityProp } from "@wordpress/core-data";

const POST_TYPES = ["post", "customer_case"];
const META_KEY = "mcb_bee_flight";

const BeeFlightPanel = () => {
	const postType = useSelect(
		(select) => select(editorStore).getCurrentPostType(),
		[],
	);
	const [meta, setMeta] = useEntityProp("postType", postType, "meta");

	if (!POST_TYPES.includes(postType)) {
		return null;
	}

	return (
		<PluginDocumentSettingPanel name="mcb-bee-flight" title="Flying bee">
			<ToggleControl
				label="Show the flying bee"
				help="A bee flies through the content as visitors scroll, landing on the last button."
				checked={!!meta?.[META_KEY]}
				onChange={(value) => setMeta({ ...meta, [META_KEY]: value })}
			/>
		</PluginDocumentSettingPanel>
	);
};

registerPlugin("mcb-bee-flight", { render: BeeFlightPanel });
