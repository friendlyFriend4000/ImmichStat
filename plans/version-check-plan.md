# Plan: Periodic Version Check & Update Button

## Objective
Implement a frontend polling mechanism to periodically check for Immich updates and display an update status button on the dashboard.

## Implementation Steps

1.  **Version Comparison Logic**
    *   Create a utility function (or inline logic in `+page.svelte`) to compare the current version (`data.version`) with the latest release version (`data.versionCheck.releaseVersion`).
    *   Handle potential 'v' prefix in `releaseVersion`.
    *   Comparison: Major > Major, or (Major == Major && Minor > Minor), etc.

2.  **Frontend Polling**
    *   Import `invalidateAll` from `$app/navigation` and `onMount`, `onDestroy` from `svelte`.
    *   Set up a timer in `onMount` to call `invalidateAll()` every 5 minutes.
    *   Clear the timer in `onDestroy`.

3.  **UI Updates (`src/routes/+page.svelte`)**
    *   Modify the layout to position the button on the right side. The current layout has a header `h1`. I will convert the header container to a Flexbox:
        ```html
        <div class="flex justify-between items-center mb-4">
            <h1 ...>Immich Server Info</h1>
            <!-- Button here -->
        </div>
        ```
    *   **Button Logic:**
        *   **Condition:** `isUpdateAvailable`
        *   **True (Update Available):** Green background (`bg-green-500`), Text "Update Available", Link to placeholder (e.g., `#`).
        *   **False (Up to Date):** Neutral/Gray background (e.g., `bg-gray-200` or text only), Text "Up to date", Disabled or no link.

## Todo List
- [ ] Create `isUpdateAvailable` logic in `src/routes/+page.svelte`.
- [ ] Implement `setInterval` polling with `invalidateAll`.
- [ ] Refactor header to flex container.
- [ ] Add the Update/Status button.
