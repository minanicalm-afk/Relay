import { NextResponse } from "next/server";
import { z } from "zod";
import {
  AGES,
  CONDITIONS,
  DEVICE_CATEGORIES,
  type Accessory,
  type Age,
  type Condition,
  type DeviceCategory,
} from "@/lib/pricing";
import { calculateCatalogOffer } from "@/lib/server-pricing";

const schema = z.object({
  category: z.string(),
  brand: z.string(),
  model: z.string().optional(),
  condition: z.string(),
  age: z.string(),
  accessories: z.array(z.string()).default([]),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid device details." }, { status: 400 });

  const data = parsed.data;
  const validCategory = DEVICE_CATEGORIES.some((item) => item.value === data.category);
  const validCondition = CONDITIONS.some((item) => item.value === data.condition);
  const validAge = AGES.some((item) => item.value === data.age);
  if (!validCategory || !validCondition || !validAge) {
    return NextResponse.json({ error: "Invalid device details." }, { status: 400 });
  }

  const result = await calculateCatalogOffer({
    category: data.category as DeviceCategory,
    brand: data.brand,
    model: data.model,
    condition: data.condition as Condition,
    age: data.age as Age,
    accessories: data.accessories as Accessory[],
  });

  return NextResponse.json(result);
}
