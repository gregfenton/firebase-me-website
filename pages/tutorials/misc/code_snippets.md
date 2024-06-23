
{{crumb:custom_claims}}
## Custom claims without Cloud Function
normally this is reserved behind a cloud function, managing users by adding and removing claims in realtime per your apps life cycle, but if you need to set a users custom claims once and forget about it, and without using a firestore document as a workaround, try this script.
{{group:code}}
```node
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./path/to/your-firebase-adminsdk-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Function to set custom claims
const setCustomClaims = async (userUids, newClaims) => {
  try {
    for (const uid of userUids) {
      // Fetch the current user
      const user = await admin.auth().getUser(uid);

      // Merge new claims with existing claims
      const currentClaims = user.customClaims || {};
      const updatedClaims = { ...currentClaims, ...newClaims };

      // Set custom user claims
      await admin.auth().setCustomUserClaims(uid, updatedClaims);
      console.log(`Updated custom claims for user UID: ${uid}`);
    }
  } catch (error) {
    console.error("Error setting custom claims:", error);
  }
};

// Example usage
const userUids = ['user1Uid', 'user2Uid', 'user3Uid'];
const newClaims = { role: 'editor' };

setCustomClaims(userUids, newClaims);
```
{{endgroup}}


## Array functions
### Batched and Grouped items
 
 Batched Array or Grouped Array is a cubic sorting function for arrays
Allowing you to iterate recursively without extreme logic hurdles.
this supports looping on the internal array item, ensuring your batch size is always true.
the length of the output array will always match the input array length / steps

```js
function groupArray(input = [], step = 1, size = 1) {
    const batches = [];
    const total = input.length;

    for (let i = 0; i < total; i += step) {
        const batch = [];
        for (let j = 0; j < size; j++) {
            const index = (i + j) % total;
            batch.push(input[index]);
        }
        batches.push(batch);
    }
    return batches;
}
```
with a step of `1` and a size of `3` this converts ['A','B','C','D','E'] to:
```
['A','B','C']
['B','C','D']
['C','D','E']
['D','E','A']
['E','A','B']
```


## Common Math functions
// please populate this with a breakdown of each one of these functions
```js
export function MathClamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
} 
export function MathInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
}
export function MathDegreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}
export function MathRadiansToDegrees(radians: number): number {
    return radians * (180 / Math.PI);
}
export function MathRoundToDecimalPlaces(value: number, decimals: number): number {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
}
export function MathIsPowerOfTwo(value: number): boolean {
    return (value & (value - 1)) === 0 && value !== 0;
}
export function MathLerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
}
export function MathMapValue(value: number, inputMin: number, inputMax: number, outputMin: number, outputMax: number): number {
    return ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) + outputMin;
}
export function MathRandomRange(min: number, max: number, seed?: number): number {
    if (seed !== undefined) {
        const x = Math.sin(seed++) * 10000;
        return min + ((x - Math.floor(x)) * (max - min));
    } else {
        return Math.random() * (max - min) + min;
    }
}
export function MathDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}
```

## Validation
### IPv4
```js
function ipv4checkRange(item) {
  // Basic health check
  const divisions = item.split('.');

  if (divisions.length !== 4) {
    return false; // An IPv4 address must have 4 divisions.
  }

  let isRange = false;

  for (let index = 0; index < divisions.length; index++) {
    const seg = divisions[index];

    if (index === divisions.length - 1 && seg.includes('/')) {
      // Check if it's a CIDR notation for a range
      const cidrParts = seg.split('/');
      if (cidrParts.length === 2 && !isNaN(Number(cidrParts[1]))) {
        isRange = true;
      }
    } else if (seg !== '*' && (seg === '' || isNaN(Number(seg)) || Number(seg) < 0 || Number(seg) > 255)) {
      // Ensure content exists for each segment and support wildcard '*'
      return false;
    }
  }

  return isRange;
}
```
### IPv6
```js
function ipv6checkRange(item) {
  const divisions = item.split(':');
  if (divisions.length < 2 || divisions.length > 8) {
    return false; // An IPv6 address must have between 2 and 8 divisions.
  }

  let isRange = false;
  divisions.forEach((seg, index) => {
    if (index === divisions.length - 1) {
      // Check if it's the last segment
      if (seg.includes('/')) {
        // Check if it's a CIDR notation for a range
        const cidrParts = seg.split('/');
        if (cidrParts.length === 2 && !isNaN(Number(cidrParts[1]))) {
          isRange = true;
        }
      } else if (seg === "" || !isNaN(Number(seg))) {
        // Allow for trailing ":1" or other interface IDs
        isRange = true;
      }
    } else if (seg.length !== 0 && seg.length !== 4) {
      // Each segment should be either 0 or exactly 4 characters in length.
      isRange = false;
    }
  });

  return isRange || divisions.length === 8; // Either a valid range or a complete IPv6 address.
}
```

## Better Boolean

The 'better boolean' function is designed to enhance the flexibility and accuracy of boolean conversion in JavaScript. It addresses common pitfalls associated with type coercion and ensures that specific string and number representations of false values are correctly interpreted as false.
Advantages:

Consistency: Converts "false" and "0" to false.
Flexibility: Handles both strings and numbers.
Modern: Uses concise arrow function syntax.
Edge Cases:

"false" -> false (vs. true in standard Boolean)
"0" -> false (vs. true in standard Boolean)

```js
export const proBoolean = (value: string | number) => ["false", "0"].includes(value.toString().toLowerCase()) ? false : Boolean(value)
```

## TS Enums
### Mapping alternative
Using TypeScript's const assertions and type inference, this approach can serve as an alternative to an enum in TypeScript. It provides type-safe mappings of keys and values with the added flexibility of using objects and arrays, while ensuring consistency and type safety.
```ts
const authMethods = ["push", "sms", "voice"] as const;
type AuthMethod = typeof authMethods[number];
const AuthMethodTitles = {} satisfies { [k in AuthMethod]: string };
type AuthMethodTitle = typeof AuthMethodTitles[keyof typeof AuthMethodTitles];

```

### Two-Way Serialization with TypeScript
This example maintains synchronization between enum values and their serialized strings, providing a robust solution for serialization and deserialization. Ensuring a two-way serializable enum is crucial for maintaining consistency between string values and their corresponding enum representations.
```ts
export type phaseType = "Metal" | "Wood" | "Earth" | "Water" | "Dark" | "Light" | "Fire";
export enum PhaseType {
  Metal,
  Wood,
  Earth,
  Water,
  Dark,
  Light,
  Fire,
}
// handler to link enum and serialized string
export const phaseHandler: { [key in phaseType]: PhaseType } = {
  Metal: PhaseType.Metal,
  Wood: PhaseType.Wood,
  Earth: PhaseType.Earth,
  Water: PhaseType.Water,
  Dark: PhaseType.Dark,
  Light: PhaseType.Light,
  Fire: PhaseType.Fire,
};

export const Elements: { [key in keyof typeof PhaseType]: phaseType } = {
  Metal: "Metal",
  Wood: "Wood",
  Earth: "Earth",
  Water: "Water",
  Dark: "Dark",
  Light: "Light",
  Fire: "Fire",
} as const;
```
