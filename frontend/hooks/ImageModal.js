import { Modal, ModalOverlay, ModalContent, Box, CloseButton } from "@chakra-ui/react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Image from "next/legacy/image";

const ImageModal = ({ isOpen, onClose, selectedImage }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent bg="transparent" boxShadow="none" display="flex" alignItems="center" justifyContent="center">
        <Box position="relative" w="full" h="100%" display="flex" justifyContent="center" alignItems="center">
          <CloseButton zIndex="1" onClick={onClose} size="lg" color="white" position="absolute" top="10px" right="10px" />
          <TransformWrapper>
            <TransformComponent>
              <Box position="relative" maxWidth="90vw" maxHeight="90vh" width="100%" height="auto" display="flex" justifyContent="center" alignItems="center">
                <Image src={selectedImage} alt="Zoomed dish" layout="intrinsic" objectFit="contain" width={800} height={500} />
              </Box>
            </TransformComponent>
          </TransformWrapper>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default ImageModal;
