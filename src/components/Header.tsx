import React from "react";
import Image from "next/image";

const Header = (props: any) => {
  return (
    <header className="hover:bg-gradient-to-r bg-gradient-to-l from-black to-indigo-950 p-4 mb-10 rounded-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            priority={false}
            src="/union.png"
            width={50}
            height={300}
            alt="Logo"
            className="h-10 rounded-lg shadow-lg"
          />
          <span className="text-white text-lg font-semibold ml-2 hidden md:block">
            itterae
          </span>
        </div>

        {/* Campo de Pesquisa */}
        <div>
          <input
            onChange={(e) => {
              props.setSearchTerm(e.target.value);
            }}
            type="text"
            placeholder="Pesquisar..."
            className="shadow-lg px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:bg-gray-900"
          />
          <button
            className="text-white font-bold py-2 px-4 rounded"
            onClick={props.loadSearchDocuments}
          >
            <Image
              priority={false}
              src="/search.svg"
              width={50}
              height={50}
              alt="Logo"
              className="h-5"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
