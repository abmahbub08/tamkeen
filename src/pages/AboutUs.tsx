import aboutUs from "../assets/undraw_add_to_cart_re_wrdo 1.svg";
import iconLabel from "../assets/Icon Label.svg";
import referral from "../assets/referral.png";
import coins from "../assets/vecteezy_pile-of-coins_21657587.png";
import goblet from "../assets/vecteezy_3d-gold-trophy-for-award-png_9875175.png";
import earn from "../assets/money-earn-svgrepo-com 2.svg";
import screwDriver from "../assets/screew.svg";
import { FaBox, FaDollarSign, FaHome, FaMoneyBillWave } from "react-icons/fa";
import { LuHeadphones } from "react-icons/lu";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";

const AboutUs = () => {
  const cardData = [
    {
      icon: <FaHome />,
      number1: "10k",
      description: "Houses sold",
    },
    {
      icon: <FaDollarSign />,
      number1: "10k",
      description: "Revenue generated",
    },
    {
      icon: <FaBox />,
      number1: "10k",
      description: "Packages delivered",
    },
    {
      icon: <FaMoneyBillWave />,
      number1: "10k",
      description: "Cash earned",
    },
  ];

  const cards2 = [
    {
      icon: <TbTruckDelivery />,
      number1: "Free and fast delivery",
      description: "Houses sold",
    },
    {
      icon:<LuHeadphones />,
      number1: "24/7 customer service",
      description: "Revenue generated",
    },
    {
      icon: <IoShieldCheckmarkOutline />,
      number1: "Money back guarantee",
      description: "Packages delivered",
    },
  ];

  const joining = [
    { img: referral, title: "Referral system" },
    { img: coins, title: "Collection coins" },
    { img: goblet, title: "Win prizes" },
    { img: earn, title: "Earn money" },
    { img: screwDriver, title: "Support" },
  ];

 

  return (
    <div className="flex flex-col gap-36 px-10 sm:px-0 mt-36">
      <section className="container flex flex-wrap items-center sm:px-36 gap-8">
        <img src={aboutUs} alt="" />{" "}
        <div className="flex max-w-[36vw] max-md:max-w-full  flex-col gap-8">
          <div className="flex gap-4 items-center">
            <img src={iconLabel} alt="" />
            <h2 className="text-primary text-xl font-semibold">ABOUT US</h2>
          </div>
          <h1 className="text-3xl font-black">Our Company Overview</h1>
          <p className="text-gray-600 leading-loose">
            Achieve the most important marketing network for products in the
            most diversified range. Convert the TAMKEEN marketing system into
            the most commercial and social platform friendly and effective that
            can exist. Meet all quality requirements within the field of
            marketing, finance, technical and commercial training, among other
            topics associated with the level scheme. Guarantee that our
            marketing chain generates productive success and economic growth for
            those who make it up, at any of its levels or areas.
          </p>
          <button className="btn btn-secondary max-w-48">Learn more</button>
        </div>
      </section>

      <div className="flex flex-wrap justify-center gap-6 mt-8">
        {cardData.map((item) => (
          <div className="card w-64 bg-base-100 rounded-lg border border-gray-200 p-4">
            <div className="flex flex-col items-center">
              <div className="text-5xl text-white bg-primary p-4 rounded-full mb-4">
                {item.icon}
              </div>
              <div className="text-xl font-semibold">{item.number1}</div>
              <p className="text-sm text-gray-400 mt-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="container px-4 sm:px-20 flex flex-wrap items-center">
        <p className="text-2xl text-primary mb-10">Why Joining TAMKEEN? </p>
        <ul className="flex flex-wrap gap-8 justify-between w-full">
          {joining.map((item) => (
            <li className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-gray-100 w-44 p-3 overflow-hidden">
                <img className="w-full" src={item.img} alt={item.title} />
              </div>

              <p className="text-xl">{item.title}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap justify-center gap-6 mt-8">
        {cards2.map((item) => (
          <div className="card w-64 bg-base-100 p-1">
            <div className="flex flex-col items-center">
              <div className="text-2xl text-white bg-primary p-4 rounded-full mb-4">
                {item.icon}
              </div>
              <div className="text-xl font-semibold">{item.number1}</div>
              <p className="text-sm text-gray-400 mt-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      
    </div>
  );
};


export default AboutUs;