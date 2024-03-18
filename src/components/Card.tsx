import ePub from "epubjs";
import Image from "next/image";
import { app } from "@/firebase/firebase";
import React, { memo, useEffect, useState } from "react";
import { CardProps } from "@/models/CardProps";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const Card: React.FC<CardProps> = ({ name }) => {
  const [cover, setCover] = useState<any>("");
  const [book, setBook] = useState<any>(null);

  useEffect(() => {
    if (name) {
      const cachedBlob = localStorage.getItem(name);
      console.log("o que tem no cache: ", cachedBlob);
      if (cachedBlob) {
        const blob: any = new Blob([cachedBlob], {
          type: "application/octet-stream",
        });
        // const url = URL.createObjectURL(blob);
        const newBook = ePub(blob);

        setBook(newBook);
        newBook.coverUrl().then((e) => {
          setCover(e);
        });
        console.log("pegou do cache: ");
      } else {
        const dowloadBook = async (fileName = name) => {
          try {
            const storage = getStorage(app);
            const fileRef = ref(
              storage,
              `gs://litterae-416622.appspot.com/${fileName}`
            );
            const downloadURL: any = await getDownloadURL(fileRef);

            const response = await fetch(downloadURL);
            const blob: any = await response.blob();
            const newBook = ePub(blob);

            setBook(newBook);
            newBook.coverUrl().then((e) => {
              setCover(e);
            });
            console.log("fez download: ");
          } catch (error) {
            console.error("Error downloading file:", error);
          }
        };
        dowloadBook();
      }

      return () => {
        if (book) {
          book.destroy();
        }
      };
    }
  }, [name]);

  const teste = async () => {
    console.log("entrou");
    await book.ready;
  };

  return (
    <div className="cursor-pointer">
      {cover && (
        <Image
          onClick={teste}
          className="flex flex-col h-96 bg-cyan-950 bg-opacity-100 rounded-lg p-0.5 shadow-lg"
          src={cover}
          width={400}
          height={200}
          alt="Capa do livro"
        />
      )}
    </div>
  );
};
export default memo(Card);
