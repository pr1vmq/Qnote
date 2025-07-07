### QNOTE REPORT CHANGELOG (Last Update: 9:00 PM - 7/7/2025)

* Initial design of a **left-screen sidebar menu** that can slide out when its icon in the top-left corner is clicked, using HTML, CSS, and JavaScript.
* Updated the sidebar UI to be **more modern and professional**, using Font Awesome for icons and CSS Flexbox for layout alignment.
* Added a **rotation effect** to the menu (hamburger) icon, causing it to **transform into an X icon** as the sidebar opens.
* Fixed bug: The **X icon was overlapping the user logo**. The solution was to separate their functions: the hamburger icon now only opens the sidebar, while the X icon for closing is located within the sidebar itself.
* Programmed the **workspace arrow icons to rotate** on click, allowing **workspaces to be collapsed and expanded** to show or hide their features.
* Added a **"Create New +" button** just above the settings section in the sidebar for creating new workspaces.
* Designed the **main content area (`#main`)** to match the mockup, featuring the title "Qnote", a welcome message, a **large blue "Create new" button** in the center, and **three floating action icons** (chatbot, team, new) in the bottom-right corner that **display tooltips on hover**.
* Fixed bug: The **menu open button was pushed to the center** of the screen and became inoperable.
* Fixed bug: The **menu icon was unclickable, the rotation effect was broken**, and the sidebar would not slide out. Re-synced HTML, CSS, and JavaScript for the dynamic menu icon.
* Added a **falling star particle effect** (Particle Network) to the page, with particles that **gradually connect to the mouse cursor** to form a linked network.
* Fixed bug: The **particle effect was not displaying**, and the background color of the main content area was missing.
* Fixed bug: The particle effect was still not displaying. Switched from the `tsParticles` library to the more reliable **`particles.js` library**.
* Fixed bug: The `particles.js` effect appeared but **did not interact with or follow the mouse cursor** on hover.
* Fine-tuned the particle effect: made particles **fainter, move slower**, and configured them so that when the cursor is stationary, **more stars connect to it** (creating an illusion of convergence without zooming).
* Constrained the particle constellations to **only appear within a horizontal band in the middle of the screen**.
* Made the **particle density sparser** and their **movement slightly slower**.
* Disabled the feature that **generates new particles on continuous clicks** and made the constellations tend to be **"dragged" by the mouse cursor**.
* Researched and implemented a method to **add an HTML snippet using JavaScript**.
* Specified the implementation to insert a new workspace HTML block **immediately after the last closing `div` with the class `sidebar-section`**.
* Fixed bug: When creating many workspaces, the excess ones would **overflow and overlap the settings and sign-out buttons**.
* Fixed bug: A **new workspace was appearing below the sign-out button**.
* Created a **pop-up modal** in the center of the screen when the `+` button in the bottom-right corner is clicked, displaying options to create 5 new features, similar to those within a workspace.
* Changed the modal logic: if no workspaces exist, it **defaults to creating the first workspace**. If workspaces already exist, the modal now **displays a list of the current workspaces** to choose from.
* When a workspace is selected in the modal, the **window expands to the right**, and the **five features of that workspace appear in the new right-hand area**, along with a button to close the expanded view.
* Added a **`+` button next to the "Select Workspace" title** within the modal to allow for creating new workspaces directly from that window.
* Fixed bug: The modal UI was broken and displayed a **redundant "Create New" text**.
* Fixed bug: The **X button was pushed to the line below** the `+` button in the modal header; they are now on the same line.
* Refined the modal header layout: the **X button is in the top-right corner**, the **"Select Workspace" title is centered at the top**, and the **`+` button (for new workspaces) is styled as a grid item**, similar in size to a workspace button.
* When too many workspaces are created in the modal, the window now **automatically scrolls** once they exceed 4 rows or 50% of the screen height.
* Fixed bug: Clicking a workspace in the select box **did not reveal its features** in the expanded view.
* Refined the modal UI: When a workspace is selected and its features are displayed, that **workspace is highlighted** to distinguish it from the others. The **title of the expanded view is changed to "Feature"** and the **title of the selection view to "Editing [WorkspaceName]"**.
* When the close button for the expanded view is clicked, the **selected workspace in the selection view is de-highlighted**. If a workspace is already highlighted, **clicking it again will close the expanded view and de-highlight it**.
* Adjusted the modal layout: when the select box appears, it is **wider**, and when the feature box is opened, the **entire two-panel view is centered on the screen**.
* Fixed bug: When hovering over a workspace item in the selection grid, the **top border of items in the top row was hidden**.
* Fixed bug: The **right border of the select box had a straight line** even before the feature box was opened.
* Fixed bug: The straight line persisted, and the feature box **lacked the same border-radius** as the select box.
* Fixed bug: The straight line at the junction between the select and feature boxes remained. The desired behavior is that when the feature box is open, the **adjoining edges are straight (no border-radius)**, the outer edges remain rounded, and a faint dividing line is present in the middle.
* Added **two options, "Setting" and "Delete,"** below the five main features in the feature box, laid out as two items per row. The modal height is fixed with a scrollbar, and **faint arrow icons appear** when the content is scrollable and not at the top/bottom.
* Fixed bug: With a scrollbar active, the **select view's container was taller than the feature view's**, creating an empty space below the feature box. Adjusted the heights of both views to be fixed.
* Fixed bug: When only one or two workspaces existed, the **items would stretch vertically** to fill the modal's height. Ensured they maintain a fixed initial size.
* Implemented the **"Delete" button**: on click, a **confirmation dialog "Are you sure..." appears** with "Cancel" and "Delete" buttons. Clicking "Delete" prompts for a password. During this confirmation, the **select and feature modals are temporarily hidden** and reappear after the dialog is closed.
* Updated the `createNewWorkspace` function to ensure **all five features are added** when creating a new workspace.
* Fixed bug: Re-clicking the customization icon (`.fa-edit.action-icon`) for a workspace **did not close the options panel**.
* Fixed bug: After deleting a workspace from the feature box and confirming, the workspace was removed from the sidebar but **remained visible in the select modal** until it was closed and reopened.
* Implemented the **"Duplicate" feature**: when the button is clicked, a copy of the workspace is created with **"(copied)" appended to its title**.
* Implemented the **"Rename" feature**: on click, the current title becomes an **input field**. If the input is cleared, the **original name appears as a placeholder**.
* Added new items to the workspace context menu: **"Add", "Sync", "Merge (auto)", "Merge (option)"**, and renamed "Change Icon" to "Customize".
* Designed a sidebar "Edit Mode": When workspaces exist, an **"Edit" button** appears. The "New workspace" button collapses to a `+` icon. Clicking "Edit" reveals a **"Cancel" (X) button**. Added **tooltips** for all icon buttons. A **checkbox** appears next to each workspace. When a checkbox is ticked, the "Edit" button transforms into a **"Delete" button** (with an updated icon, color, and tooltip).
* Fixed bug: Clicking a workspace's edit icon **still triggered its collapse/expand action**.
* Fixed bug: After clicking "Delete" from the sidebar context menu, the confirmation dialog appeared, but after it was closed, the **"Select Workspace" modal would incorrectly appear**.
* Completed the functionality to **permanently delete a workspace** when the "Confirm Delete" button in the warning dialog is clicked.
* Fixed bug: The "New workspace" button's UI was altered, the **"Cancel" button was visible even without any workspaces**, and the **"Edit" button was missing**.
* Fixed bug: The "New workspace" button was moved to the top of the sidebar. **Repositioned it to be fixed above the settings button**.
* Fixed bug: The main screen had an **unnecessary scrollbar** even when all content was visible.
* Fixed bug: A newly created workspace **only contained a single "Note" feature** instead of the full set.
