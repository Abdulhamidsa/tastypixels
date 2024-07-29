import { Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody } from "@chakra-ui/react";
import Image from "next/image";

const ZoomModal = ({ isOpen, onClose, imageUrl }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody p={0}>
          <Image alt={imageUrl} src={imageUrl} width={0} height={0} sizes="100vw" style={{ width: "100%", height: "auto" }} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ZoomModal;
