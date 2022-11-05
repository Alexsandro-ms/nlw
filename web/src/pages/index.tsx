/* Importando o `FormEvent` e o `useState` da biblioteca `react`. */
import React, { FormEvent, useState } from "react";

/* Importando imagens. */
import Image from "next/image";
import appPreviewImg from "../assets/app-nlw.png";
import logoImg from "../assets/logo.svg";
import usersAvatarExampleImg from "../assets/avatares.png";
import iconCheckImg from "../assets/icon.svg";

/* Importando o objeto `api` da biblioteca `axios`. */
import { api } from "../lib/axios";

/* Está definindo o tipo de props que o componente irá receber. */
interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {
  /* Criando uma variável de estado chamada `poolTitle` e uma função chamada `setPoolTitle` para atualizar o
  Estado variável do input. */
  const [poolTitle, setPoolTitle] = useState("");

  const createPool = async (event: FormEvent) => {
    /* Impede o comportamento padrão do formulário, que é recarregar a página. */
    event.preventDefault();
    try {
      /* Enviando uma solicitação POST para a API com o valor do input, como parâmetro de title. */
      const response = await api.post("pools", {
        title: poolTitle
      });

      /* Está desestruturando o objeto response.data. */
      const { code } = response.data;
      /* Função que grava o texto na área de transferência. */
      await navigator.clipboard.writeText(code);
      /* Está limpando do input */
      setPoolTitle("");
      /* É uma função que mostra uma mensagem para o usuário. */
      alert(
        "Bolão criado com sucesso, código copiado para a área de transferência!"
      );
    } catch (err) {
      console.log(err);
      alert("Erro ao tentar criar o bolão");
    }
  };
  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28">
      <main>
        <Image src={logoImg} alt="NLW Copa" />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão e compartilhe entre amigos!
        </h1>
        <div className="mt-18 flex items-center gab-2">
          <Image src={usersAvatarExampleImg} alt="" quality={100} />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount} </span>
            pessoas já estão usando
          </strong>
        </div>
        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            required
            placeholder="Qual o seu bolão?"
            value={poolTitle}
            onChange={(e) => setPoolTitle(e.target.value)}
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>
        <div className="mt-10 pt-10 border-t border-gray-600 flex justify-between items-center text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600"></div>
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image
        src={appPreviewImg}
        alt="Dois celulares exibindo uma prévia do nlw móvel"
        quality={100}
      />
    </div>
  );
}

export const getServerSideProps = async () => {
  /* Fazendo várias solicitações ao mesmo tempo. */
  const [poolCountResponse, guessesCountResponse, usersCountResponse] =
    await Promise.all([
      api.get("pools/count"),
      api.get("guesses/count"),
      api.get("users/count")
    ]);

  /* Retornando os dados da API. */
  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessesCountResponse.data.count,
      userCount: usersCountResponse.data.count
    }
  };
};
