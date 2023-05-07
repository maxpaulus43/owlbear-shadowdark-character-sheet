import "../static/app.css";
import Popover from "./Popover.svelte";

const popover = new Popover({
  target: document.getElementById("popover"),
});

export default popover;
