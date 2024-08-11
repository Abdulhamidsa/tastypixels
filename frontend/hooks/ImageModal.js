import { Modal, ModalOverlay, ModalContent, Box, CloseButton } from "@chakra-ui/react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Image from "next/legacy/image";

const ImageModal = ({ isOpen, onClose, selectedImage }) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none" display="flex" alignItems="center" justifyContent="center">
          <Box position="relative" w="100%" h="100%" display="flex" justifyContent="center" alignItems="center">
            <CloseButton zIndex="1" onClick={onClose} size="lg" color="white" position="absolute" top="10px" right="10px" />
            <TransformWrapper>
              <TransformComponent>
                <Box position="relative" w="700px" maxW="600px" h="auto">
                  <Image src={selectedImage} alt="Zoomed dish" objectFit="contain" layout="fixed" width={400} height={500} sizes="(max-width: 600px) 100vw, 600px" />
                </Box>
              </TransformComponent>
            </TransformWrapper>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ImageModal;
