import Image from "next/image";
export default function ArsemaLogo() {
    return (
      
      <Image
              src="/images/logo-arsema.jpg"
              alt="Arsema Logo"
              width={200}
              height={200}
             className="mx-auto object-cover text-center items-center"
              priority
            />
       
    );
  }