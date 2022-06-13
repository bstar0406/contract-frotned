import Art from "./art";
import Mentor from "./mentor";
import Ticket from "./ticket";
import Experience from "./experience";
import Influencer from "./influencer";
import { useParams } from "react-router-dom";

export default function CenteredGrid(props) {
  let { address } = useParams();

  return address === "0x1fe03b49ca7952f4d4b769dcc2c27aa36da13701" ? (
    <Art />
  ) : address === "0x86952f271722143a956ff3e01512a8265b88da2d" ? (
    <Mentor />
  ) : address === "0xc9bf922e1385ee02f4832e12e17af61dc08c1a35" ? (
    <Experience />
  ) : address === "0xc430a8bbe3428610336b24c82682176b7ce08932" ? (
    <Influencer />
  ) : address === "0xbd25b61da1ec2555d4ec450a716cf172aefca2b7" ? (
    <Ticket />
  ) : (
    <h3> not found</h3>
  );
}
