'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { interFont } from '@/app/fonts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

interface CustomReagentDialogProps {
  onAdd: (name: string) => void;
}

export function CustomReagentDialog({ onAdd }: CustomReagentDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd(name);
    setName('');
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#0F172A] text-white hover:bg-[#272E3F] p-4  py-6 text-md">
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Reagent
          </Button>
        </DialogTrigger>
        <DialogContent
          className={`${interFont.className} bg-white border-[#F7F8F9] max-w-lg `}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Add Custom Reagent
            </DialogTitle>
            <DialogDescription className="font-medium text-[#838FA2]">
              Create a lab-specific reagent
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="pb-1" htmlFor="name">
                Reagent Name
              </Label>
              <Input
                className="border-[#dbdcdd] p-4 py-5 text-md"
                id="name"
                placeholder="Custom Antibody Solution"
              />
            </div>
            <div>
              <Label className="pb-1" htmlFor="description">
                Description
              </Label>
              <Textarea
                className="border-[#dbdcdd] p-4  text-md"
                id="description"
                placeholder="Detailed description of the reagent..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="pb-1 text-md" htmlFor="quantity">
                  Initial Quantity
                </Label>
                <Input
                  className="border-[#dbdcdd] p-4 py-5 text-md"
                  id="quantity"
                  type="number"
                  placeholder="50"
                />
              </div>
              <div>
                <Label className="pb-1 text-md" htmlFor="unit">
                  Unit
                </Label>
                <Select>
                  <SelectTrigger className="border-[#dbdcdd] w-full p-4 py-5 text-md">
                    <SelectValue
                      className="border-[#F7F8F9] text-lg"
                      placeholder="ml"
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#F7F8F9] shadow-sm">
                    <SelectItem className="pl-3 hover:bg-gray-200" value="ml">
                      ml
                    </SelectItem>
                    <SelectItem className="pl-3 hover:bg-gray-200" value="l">
                      l
                    </SelectItem>
                    <SelectItem className="pl-3 hover:bg-gray-200" value="kit">
                      kit
                    </SelectItem>
                    <SelectItem className="pl-3 hover:bg-gray-200" value="vial">
                      vial
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="pb-1 text-md" htmlFor="expiry">
                Expiry Date
              </Label>
              <Input
                className="border-[#dbdcdd] text-md"
                id="expiry"
                type="date"
              />
            </div>
            <div>
              <Label className="pb-1 text-md" htmlFor="threshold">
                Reorder Threshold
              </Label>
              <Input
                className="border-[#dbdcdd] p-4 py-5 text-md"
                id="threshold"
                type="number"
                placeholder="15"
              />
            </div>
            <Button className="w-full bg-black text-white cursor-pointer hover:bg-gray-800">
              Add Custom Reagent
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
