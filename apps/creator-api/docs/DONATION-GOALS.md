# Donation Goals

This document describes the Donation Goals feature in the Creator API.

## Overview

Donation Goals enable creators to set fundraising targets for specific time periods. The system tracks progress towards these goals by automatically associating incoming donations with active goals.

## Key Features

- Each creator can have multiple donation goals, but only one active goal at a time
- Goals have a name, target amount, start date, and end date
- Automatic association of new donations with active goals
- Progress tracking and top donor identification

## Data Model

Check DonationGoal Entity

```typescript
@Entity('donation_goal')
```

### Donation Association

Donations are linked to donation goals through a foreign key in the Donation entity:

```typescript
@ManyToOne(() => DonationGoal, donationGoal => donationGoal.donations, {
  nullable: true
})
@JoinColumn({ name: 'donation_goal_id' })
donationGoal?: DonationGoal;
```

## Important Behaviors

1. **Automatic Association**:

   - When a new donation is received, a database trigger automatically checks if there's an active donation goal for the recipient
   - If found and the donation's timestamp is within the goal's timeframe, the donation is associated with that goal
   - **Note**: Only new donations are automatically associated. Existing donations before a goal was activated will not be retroactively associated

2. **Activating Goals**:

   - When a goal is activated, any other active goals for the same creator are automatically deactivated
   - Only one goal can be active per creator at any time

3. **Timeframe Handling**:
   - A donation is only associated with a goal if the donation timestamp falls within the goal's start and end dates
   - Donations outside this timeframe will not be associated, even if the goal is active

## API Endpoints

### Get Donation Goals

```
GET /donation-goal/:creatorName
```

Returns all donation goals for a creator, with active goals first.

### Create Donation Goal

```
POST /donation-goal
```

Creates a new donation goal. If marked as active, deactivates other goals for the creator.

### Activate Goal

```
PATCH /donation-goal/:goalId/activate
```

Activates a goal and deactivates all other goals for the creator.

### Deactivate Goal

```
PATCH /donation-goal/:goalId/deactivate
```

Deactivates a goal.

## Implementation Details

The automatic association is implemented using a PostgreSQL trigger that executes after a new donation is inserted:

```sql
CREATE OR REPLACE FUNCTION associate_donation_with_goal()
RETURNS TRIGGER AS $$
BEGIN
  -- Find the active donation goal for this creator at the time of donation
  UPDATE creator_donations
  SET donation_goal_id = (
    SELECT dg.id
    FROM donation_goal dg
    JOIN creator c ON c.id = dg.creator_id
    JOIN creator_address ca ON ca.creator_id = c.id
    WHERE NEW.to_address = ca.address
      AND dg.active = true
      AND NEW.timestamp >= dg.start_date
      AND NEW.timestamp <= dg.end_date
    LIMIT 1
  )
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```
