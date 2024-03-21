"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/server/client";
import Image from "next/image";
import React, { useRef, useState } from "react";

export default function SpellbookPage({
  params,
}: {
  params: { spellbook: number };
}) {
  const spellbook = trpc.spellbooks.getById.useQuery({
    id: +params.spellbook,
  });
  const addSpell = trpc.spells.create.useMutation();
  const delSpell = trpc.spells.delete.useMutation();

  const addNewSpell = () => {
    if (!spellbook.data?.id) {
      return;
    }
    if (fileRef.current?.files) {
      const formData = new FormData();
      const file = fileRef.current.files[0];
      formData.append("files", file);
      const request = { method: "POST", body: formData };
      fetch("/api/file", request);
      addSpell.mutate(
        {
          title,
          description,
          spellbookId: spellbook.data?.id,
          image: `/${file.name}`,
        },
        {
          onSettled: () => spellbook.refetch(),
        }
      );

      setTitle("");
      setDescription("");
    }
  };

  const deleteSpell = (id: number) => {
    delSpell.mutate(
      {
        id,
      },
      {
        onSettled: () => spellbook.refetch(),
      }
    );
  };

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-24">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add Spell</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create your spell</DialogTitle>
            <DialogDescription>
              Add some powerful spell to your {spellbook.data?.title}
            </DialogDescription>
            <div className="flex flex-col gap-3">
              <p>Title:</p>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              <p>Description:</p>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p>Image:</p>
              <Input type="file" ref={fileRef} />
              <Button onClick={addNewSpell}>Save</Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Table>
        <TableCaption>Spells from {spellbook.data?.title}.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {spellbook.data?.spells.map((spell) => (
            <TableRow key={spell.id}>
              <TableCell>{spell.title}</TableCell>
              <TableCell>{spell.description}</TableCell>
              <TableCell>
                {spell.image && (
                  <Image
                    src={spell.image}
                    width={50}
                    height={50}
                    alt={spell.title}
                  />
                )}
              </TableCell>
              <TableCell>
                <Button onClick={() => deleteSpell(spell.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
