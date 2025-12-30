This guide explains how to add a custom explore page for new partners (e.g., /explore/avalanche) to the IDRISS platform. The process involves creating a few files and is designed to be accessible to
non-developers.
## Overview

Each partner explore page consists of:

- A custom theme (colors, styling)
- A data file with streamers
- A page component that brings everything together

## Step-by-Step Instructions

### 1. Create the Partner Directory

Create a new folder under `apps/main-landing/src/app/explore/` with your partner name:

`apps/main-landing/src/app/explore/[partner-name]/`


For example, for Avalanche: `apps/main-landing/src/app/explore/avalanche/`

### 2. Create the Data File

Create a `data.json` file in your partner directory with your streamers data.

File: `apps/main-landing/src/app/explore/[partner-name]/data.json`

```json
[
  {
    "header": "Featured",
    "users": [
      {
        "id": "unique-id-1",
        "name": "StreamerName",
        "profilePictureUrl": "https://example.com/profile.jpg",
        "description": "Brief description of the streamer",
        "donationLink": "https://idriss.xyz/streamername",
        "languages": "English, Spanish",
        "filters": "Gaming, DeFi, NFT",
        "featured": true
      }
    ]
  },
  {
    "header": "[Category Name]",
    "users": [
      {
        "id": "unique-id-2",
        "name": "AnotherStreamer",
        "profilePictureUrl": "https://example.com/profile2.jpg",
        "description": "Another creator description",
        "followLink": "https://www.twitch.tv/anotherstreamer",
        "languages": "English",
        "filters": "Gaming, Blockchain",
        "stats": {
          "followers": "1.2K"
        }
      }
    ]
  }
]
```

The file is separated in categories, and each category has its `header` property (category name) and the `users` property (streamers).

Streamer fields:

- id: Unique identifier for each creator
- name: Creator's display name
- profilePictureUrl: URL to creator's profile image
- description: Brief description (optional, shows only for featured creators)
- donationLink: IDRISS donation link (creates "DONATE" button)
- followLink: External follow link (creates "FOLLOW" button if no donation link)
- languages: Comma-separated languages (used for filtering, badge on page shows first lannguage on list)
- filters: Comma-separated tags/categories (used for filtering, badge on page shows first filter on list)
- featured: Set to true for featured creators (larger cards with descriptions)
- stats.followers: Follower count display (e.g., "1.2K", "567")

### 3. Create the Theme Configuration

Create a `theme.ts` file in your partner directory to define colors and styling.

File: `apps/main-landing/src/app/explore/[partner-name]/theme.ts`

```ts
import type { HubTheme } from '../common/hub-page';

export const PARTNER_THEME: HubTheme = {
  // Background gradient for the entire page
  radialBg: 'bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#YOUR_COLOR_1_0%,_#YOUR_COLOR_2_100%)]',

  // Filter button styles (inactive state)
  filterBorder: 'border-[#YOUR_BORDER_COLOR]',
  filterText: 'text-[#YOUR_TEXT_COLOR]',

  // Filter button styles (active state)
  filterActiveBorder: 'border-[#YOUR_ACTIVE_BORDER_COLOR]',
  filterActiveBg: 'bg-[#YOUR_ACTIVE_BG_COLOR]',

  // Streamer card theme configuration
  cardTheme: {
    // Card background
    backgroundClass: 'bg-white',

    // Follower count text color
    followersTextClass: 'text-[#YOUR_FOLLOWERS_TEXT_COLOR]',

    // Donate/Follow button styling
    donateButtonIntent: 'primary', // or 'secondary'
    donateButtonClass: 'w-full',

    // Featured card styling (optional)
    borderClass: 'border-[#YOUR_FEATURED_BORDER_COLOR]',
    colorScheme: 'blue', // optional color scheme
    featuredBackgroundClass: 'bg-gradient-to-br from-[#COLOR1] to-[#COLOR2]',
    featuredNameTextClass: 'text-white',
  },

  // Title styling (optional)
  titleClass: 'font-bold text-shadow-lg',
};
```

Color Examples:

- Use hex colors: `#FF6B6B, #4ECDC4, #45B7D1`
- Use gradients: `bg-gradient-to-br from-blue-500 to-purple-600`
- Use Tailwind classes: `bg-blue-500, text-white, border-gray-300`

### 4. Create the Page Component

Create a `page.tsx` file that combines your theme and data.

File: `apps/main-landing/src/app/explore/[partner-name]/page.tsx`

```ts
import HubPage from '../common/hub-page';
import { PARTNER_THEME } from './theme';
import streamersData from './data.json';

export default function PartnerExplorePage() {
  return (
    <HubPage
      title="[Partner Name] Hub"
      bannerImage="/images/explore/[partner-name]-banner.jpg"
      groups={streamersData}
      theme={PARTNER_THEME}
      align="left" // or "center"
      partnerLogo="/images/explore/[partner-name]-logo.png" // optional
    />
  );
}
```

Configuration Options:

- title: The main title displayed on the banner
- bannerImage: Path to banner background image
- groups: Your imported data from data.json
- theme: Your imported theme configuration
- align: Banner content alignment ("center" or "left")
- partnerLogo: Optional partner logo displayed on banner, recommended for left alignment banners

### 5. Add Banner and Logo Images

Add your images to the public directory:


`public/images/explore/[partner-name]-banner.jpg`
`public/images/explore/[partner-name]-logo.png  (optional)`


Image Requirements:

 • Banner: 1176x180px recommended, landscape format
 • Logo: Height should be around 32px (8rem), transparent background preferred

### 6. Example: Complete Avalanche Setup

Here's a complete example for an Avalanche partner page:

Directory structure:

```
apps/main-landing/src/app/explore/avalanche/
├── data.json
├── theme.ts
└── page.tsx
```

avalanche/theme.ts:

```ts
import type { HubTheme } from '../common/hub-page';

export const AVALANCHE_THEME: HubTheme = {
  radialBg: 'bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E74C3C_0%,_#C0392B_100%)]',
  filterBorder: 'border-red-300',
  filterText: 'text-red-700',
  filterActiveBorder: 'border-red-500',
  filterActiveBg: 'bg-red-500',
  cardTheme: {
    backgroundClass: 'bg-white',
    followersTextClass: 'text-red-600',
    donateButtonIntent: 'primary',
    donateButtonClass: 'w-full',
    borderClass: 'border-red-400',
    featuredBackgroundClass: 'bg-gradient-to-br from-red-500 to-red-700',
    featuredNameTextClass: 'text-white',
  },
  titleClass: 'font-bold text-shadow-lg',
};
```

avalanche/page.tsx:

```ts
import HubPage from '../common/hub-page';
import { AVALANCHE_THEME } from './theme';
import streamersData from './data.json';

export default function AvalancheExplorePage() {
  return (
    <HubPage
      title="Avalanche Hub"
      bannerImage="/images/explore/avalanche-banner.jpg"
      groups={streamersData}
      theme={AVALANCHE_THEME}
      align="center"
      partnerLogo="/images/explore/avalanche-logo.png"
    />
  );
}
```

### 7. Testing Your Page

After creating all files, your page will be accessible at:


https://idriss.xyz/explore/[partner-name]


For example: https://idriss.xyz/explore/avalanche


Additional tips:

- Colors: Use online color picker tools to get hex codes
- Images: Ensure images are web-optimized (JPG/PNG, reasonable file size, the smaller the better for fast loading)
- Data: Keep creator names and IDs unique across your data file
- Testing: Ask a developer to help test the page before going live
- Validation: Use JSON validators online to check your data.json syntax


Common Issues:

- Missing images: Ensure image paths are correct and files exist
- JSON syntax errors: Use a JSON validator to check your data file
- Color issues: Make sure hex colors include the # symbol
- Broken links: Verify all donation and follow links work correctly
