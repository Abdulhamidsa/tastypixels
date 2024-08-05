import { Modal, ModalOverlay, ModalContent, Box, CloseButton } from "@chakra-ui/react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Image from "next/image";

const ImageModal = ({ isOpen, onClose, selectedImage }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="full">
    <ModalOverlay />
    <ModalContent bg="transparent" boxShadow="none">
      <Box m="auto" position="relative">
        <Box style={{ display: "flex", justifyContent: "flex-end" }}>
          <CloseButton onClick={onClose} size="lg" color="white" />
        </Box>
        <TransformWrapper>
          <TransformComponent>
            <Image src={selectedImage} alt="dish image" width={600} height={250} sizes="100vw" />
          </TransformComponent>
        </TransformWrapper>
      </Box>
    </ModalContent>
  </Modal>
);

export default ImageModal;
