# Confirmation Component

A reusable confirmation modal component for consistent user confirmations throughout the application.

## Features

-   ✅ Configurable title, message, and button text
-   ✅ Two variants: `default` (green) and `danger` (red)
-   ✅ Click outside to close functionality
-   ✅ Customizable styling
-   ✅ Support for React nodes as message content
-   ✅ Auto-close after confirmation
-   ✅ Proper event handling and accessibility

## Usage

### Basic Example

\`\`\`tsx
import Confirmation from "@/components/ui/Confirmation"

const [showConfirm, setShowConfirm] = useState(false)

const handleDelete = () => {
// Your delete logic here
console.log("Item deleted")
}

return (
<>
<button onClick={() => setShowConfirm(true)}>
Delete Item
</button>

    <Confirmation
      isOpen={showConfirm}
      onClose={() => setShowConfirm(false)}
      onConfirm={handleDelete}
      title="Delete Item"
      message="Are you sure you want to delete this item? This action cannot be undone."
      confirmText="Delete"
      variant="danger"
    />

</>
)
\`\`\`

### Default Variant (Green Theme)

\`\`\`tsx
<Confirmation
isOpen={showLogout}
onClose={() => setShowLogout(false)}
onConfirm={handleLogout}
title="Confirm Logout"
message="Are you sure you want to logout?"
confirmText="Logout"
variant="default"
/>
\`\`\`

### Danger Variant (Red Theme)

\`\`\`tsx
<Confirmation
isOpen={showDelete}
onClose={() => setShowDelete(false)}
onConfirm={handleDelete}
title="Delete Account"
message="Are you sure you want to delete your account? This action cannot be undone."
confirmText="Delete Account"
variant="danger"
/>
\`\`\`

### Complex Message with React Nodes

\`\`\`tsx
<Confirmation
isOpen={showConfirm}
onClose={() => setShowConfirm(false)}
onConfirm={handleAction}
title="Important Action"
message={
<div>
<p>This will perform the following actions:</p>
<ul className="list-disc ml-5 mt-2">
<li>Delete all user data</li>
<li>Remove account access</li>
<li>Cancel all subscriptions</li>
</ul>
<p className="mt-2 font-semibold text-red-600">This cannot be undone!</p>
</div>
}
confirmText="I Understand, Delete"
variant="danger"
/>
\`\`\`

## Props

| Prop            | Type           | Default     | Description                      |
| --------------- | -------------- | ----------- | -------------------------------- | --------------------- |
| \`isOpen\`      | \`boolean\`    | -           | Whether the modal is visible     |
| \`onClose\`     | \`() => void\` | -           | Called when modal should close   |
| \`onConfirm\`   | \`() => void\` | -           | Called when user confirms action |
| \`title\`       | \`string\`     | -           | Modal title                      |
| \`message\`     | \`string \\    | ReactNode\` | -                                | Modal message content |
| \`confirmText\` | \`string\`     | "Confirm"   | Text for confirm button          |
| \`cancelText\`  | \`string\`     | "Cancel"    | Text for cancel button           |
| \`variant\`     | \`"default" \\ | "danger"\`  | "default"                        | Visual theme variant  |
| \`className\`   | \`string\`     | ""          | Additional CSS classes           |

## Styling

### Default Variant

-   Title: Dark gray
-   Confirm button: Primary green with hover effect

### Danger Variant

-   Title: Red
-   Confirm button: Red with hover effect

Both variants have:

-   Cancel button: Gray border with hover effect
-   Backdrop: Semi-transparent black
-   Modal: White background with rounded corners and shadow

## Accessibility

-   Click outside modal to close
-   Event propagation properly handled
-   Focus management for keyboard navigation
-   Semantic HTML structure
