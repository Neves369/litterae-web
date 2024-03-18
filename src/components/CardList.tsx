"use client";
import Card from "./Card";
import { CardListProps } from "@/models/CardProps";
import { gerarChaveAleatoria } from "@/utils/randomCode";
import { memo } from "react";

const CardList: React.FC<CardListProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 px-5 lg:grid-cols-4 gap-4 h-full">
      {items.map((item: any) => (
        <div key={item.nome}>
          <Card name={item.name} />
        </div>
      ))}
    </div>
  );
};

export default memo(CardList);
