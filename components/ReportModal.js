// import React, { useCallback } from "react";
// import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from "@chakra-ui/react";
// const ReportModal = ({ isOpen, onClose, onReport, uploadId }) => {
//   const handleReport = useCallback(async () => {
//     try {
//       await onReport(uploadId);
//       onClose();
//     } catch (error) {
//       console.error("Error submitting report:", error);
//     }
//   }, [onReport, uploadId, onClose]);

//   return (
//     <Modal isOpen={isOpen} onClose={onClose}>
//       <ModalOverlay bg="rgba(0, 0, 0, 0.6)" />
//       <ModalContent>
//         <ModalHeader>Report Upload</ModalHeader>
//         <ModalCloseButton />
//         <ModalBody>Are you sure you want to report this post?</ModalBody>
//         <ModalFooter>
//           <Button variant="outline" mr={3} onClick={onClose}>
//             Cancel
//           </Button>
//           <Button colorScheme="orange" onClick={handleReport}>
//             Report
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default ReportModal;
