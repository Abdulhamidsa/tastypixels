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
            <CloseButton onClick={onClose} size="lg" color="white" position="absolute" top="10px" right="10px" />
            <TransformWrapper>
              <TransformComponent>
                <Box position="relative" w="600px" h="600px">
                  <Image src={selectedImage} alt="Zoomed dish" objectFit="contain" layout="" width={700} height={700} sizes="70vw" />
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
