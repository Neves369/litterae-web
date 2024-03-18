"use client";
import { app } from "@/firebase/firebase";
import { useEffect, useState } from "react";
import CardList from "@/components/CardList";

import { getStorage, ref, list, getMetadata, listAll } from "firebase/storage";
import { Typography } from "@material-tailwind/react";
import Header from "@/components/Header";
import Modal from "@/components/Modal";
import EbookReader from "@/components/Reader";
import FullScreenModal from "@/components/Modal";
import FullScreenEpubReader from "@/components/Modal";

export default function Home() {
  const INITIAL_PAGE_SIZE: number = 16;
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageToken, setPageToken] = useState<any>("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [storageDocuments, setStorageDocuments] = useState<any>([]);
  const [previusStorageDocuments, setPreviusStorageDocuments] = useState<any>(
    []
  );

  useEffect(() => {
    const fetchInitialDocuments = async () => {
      try {
        const storage = getStorage(app);
        const result = await list(
          ref(storage, "gs://litterae-416622.appspot.com"),
          {
            maxResults: INITIAL_PAGE_SIZE,
          }
        );
        const docsData = await extractDocsData(result.items);
        setStorageDocuments(docsData);
        setPreviusStorageDocuments(docsData);
        setPageToken(result.nextPageToken);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching initial documents:", error);
      }
    };
    fetchInitialDocuments();
  }, []);

  useEffect(() => {
    if (searchTerm.length == 0) {
      setStorageDocuments(previusStorageDocuments);
    }
  }, [searchTerm]);

  const extractDocsData = async (items: any) => {
    return Promise.all(
      items.map(async (itemRef: any) => {
        const metadata = await getMetadata(itemRef);
        return {
          name: metadata.name,
          size: metadata.size,
          contentType: metadata.contentType,
          timeCreated: metadata.timeCreated,
        };
      })
    );
  };

  const loadMoreDocuments = async () => {
    setLoading(true);
    try {
      if (pageToken) {
        const storage = getStorage(app);
        const result = await list(
          ref(storage, "gs://litterae-416622.appspot.com"),
          { maxResults: INITIAL_PAGE_SIZE, pageToken }
        );
        const nextDocsData = await extractDocsData(result.items);
        setStorageDocuments([...storageDocuments, ...nextDocsData]);
        setPreviusStorageDocuments([...storageDocuments, ...nextDocsData]);
        setPageToken(result.nextPageToken);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching more documents:", error);
    }
  };

  const loadSearchDocuments = async () => {
    const storage = getStorage(app);
    const result = await listAll(
      ref(storage, "gs://litterae-416622.appspot.com")
    );

    const docsData = await extractDocsData(result.items);
    const arquivosFiltrados = docsData.filter((item) =>
      item.name
        ?.toLowerCase()
        .normalize()
        .includes(searchTerm.toLowerCase().normalize())
    );
    setStorageDocuments(arquivosFiltrados);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <main className="container mx-auto py-8 h-full">
      <Header
        setSearchTerm={setSearchTerm}
        loadSearchDocuments={loadSearchDocuments}
      />
      <CardList items={storageDocuments} />
      {searchTerm.length === 0 && (
        <div className=" mt-10 flex items-center justify-center gap-8">
          <button
            className=" hover:bg-cyan-950 text-white font-bold py-2 px-4 rounded shadow-lg"
            onClick={loadMoreDocuments}
          >
            <Typography color="gray" className="font-normal">
              Carregar mais...
            </Typography>
          </button>
        </div>
      )}
      {modalIsOpen && (
        <FullScreenEpubReader onClose={closeModal} epubUrl={""} />
      )}
    </main>
  );
}
