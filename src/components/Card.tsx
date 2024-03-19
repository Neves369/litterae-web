import ePub from "epubjs";
import Image from "next/image";
import { app } from "@/firebase/firebase";
import React, { memo, useEffect, useState } from "react";
import { CardProps } from "@/models/CardProps";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const Card: React.FC<CardProps> = ({ name, openModal }) => {
  const [cover, setCover] = useState<any>("");
  const [book, setBook] = useState<any>(null);
  const [object, setObject] = useState<any>();

  useEffect(() => {
    if (name) {
      const cachedBlob = localStorage.getItem(name);
      if (cachedBlob) {
        const blob: any = new Blob([cachedBlob], {
          type: "application/octet-stream",
        });
        setObject(blob);
        const newBook = ePub(blob);

        setBook(newBook);
        newBook.coverUrl().then((e) => {
          setCover(e);
        });
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

            setObject(blob);
            setBook(newBook);
            newBook.coverUrl().then((e) => {
              setCover(e);
            });
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

  return (
    <div
      className="cursor-pointer hover:mt-[-10px]"
      onClick={() => {
        openModal(object);
      }}
    >
      {cover && (
        <Image
          className="flex flex-col lg:h-96 hover:bg-gradient-to-l bg-gradient-to-r from-sky-900 to-indigo-900 rounded-lg p-0 hover:p-1 shadow-lg"
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
