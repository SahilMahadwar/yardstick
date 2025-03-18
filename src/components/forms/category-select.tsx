"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionCategory } from "@/types/transaction";
import {
  Building2,
  Car,
  Heart,
  HelpCircle,
  PartyPopper,
  ShoppingBag,
  UtensilsCrossed,
  Wifi,
} from "lucide-react";
import * as React from "react";

const CATEGORY_ICONS = {
  [TransactionCategory.HOUSING]: Building2,
  [TransactionCategory.TRANSPORTATION]: Car,
  [TransactionCategory.FOOD]: UtensilsCrossed,
  [TransactionCategory.UTILITIES]: Wifi,
  [TransactionCategory.ENTERTAINMENT]: PartyPopper,
  [TransactionCategory.HEALTHCARE]: Heart,
  [TransactionCategory.SHOPPING]: ShoppingBag,
  [TransactionCategory.OTHER]: HelpCircle,
};

interface CategorySelectProps {
  value?: TransactionCategory;
  onValueChange?: (value: TransactionCategory) => void;
  error?: string;
}

export function CategorySelect({
  value,
  onValueChange,
  error,
}: CategorySelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={error ? "border-destructive" : ""}
        aria-label="Select category"
      >
        <SelectValue placeholder="Select a category">
          {value && (
            <div className="flex items-center gap-2">
              {React.createElement(CATEGORY_ICONS[value], {
                className: "h-4 w-4",
              })}
              <span>{value}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.values(TransactionCategory).map((category) => {
            const Icon = CATEGORY_ICONS[category];
            return (
              <SelectItem
                key={category}
                value={category}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {category}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
