import React from 'react';
import {
  IconButton,
  Textarea,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Button,
  Box,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { useDisclosure } from '@chakra-ui/hooks';
import { useState } from 'react';
import { useToast } from '@chakra-ui/react';

function Demo() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [feedback, setFeedback] = useState('');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const toast = useToast();
  const handleFeedbackSubmit = async () => {
    try {
      const response = await fetch('/api/api-send-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback }),
      });

      if (response.ok) {
        toast({
          title: 'Feedback sent.',
          description: 'Thank you for your feedback!',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        setFeedback('');
        setIsFeedbackOpen(false);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to send feedback. Please try again.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while sending feedback. Please try again.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };
  return (
    <>
      <Tooltip label="Demo Info" fontSize="md">
        <IconButton
          pl={3}
          bg="red.500"
          color=""
          size="lg"
          aria-label="About this demo"
          icon={<InfoIcon />}
          top={150}
          onClick={onOpen}
          position="fixed"
          left="-4"
          _hover={{ left: '0px' }}
          transform="translateY(-50%)"
          borderRadius="0%"
          transition="all 0.2s ease-in-out"
        />
      </Tooltip>
      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>About This Demo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="lg" mb={4}>
              Welcome to our Food Dish Sharing Community!
            </Text>
            <Box display="flex" flexDirection="column" gap={2}>
              <Text mb={2}>
                This demo website allows you to share your favorite dishes with the community. You can:
              </Text>
              <Text>• Sign up to create an account and log in to manage your uploads.</Text>
              <Text>• Upload your favorite dishes along with images, titles, and descriptions.</Text>
              <Text>• View your uploads on your profile page.</Text>
              <Text>• Delete any of your uploads if you change your mind.</Text>
              <Text>• Like and dislike dishes to show your appreciation or feedback.</Text>
              <Text>• Leave comments on dishes to share your thoughts and interact with others.</Text>
              <Text>• Edit your own uploads to update details as needed.</Text>
              <Text>• Report inappropriate content for review by moderators.</Text>
            </Box>

            <Text mt={4} fontWeight="bold">
              Note: This is only a demo, so everything is just a prototype. All features and content will be finalized
              in the final version.
            </Text>
            <Text mt={2}>
              This website is an ongoing project for my school exam. Your feedback and participation are greatly
              appreciated!
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="orange" onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="teal" onClick={() => setIsFeedbackOpen(true)} ml={3}>
              Send Feedback
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal size="2xl" isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send Feedback</ModalHeader>
          <ModalBody>
            <Text textAlign="center" fontSize="lg" mb={4}>
              We&apos;d love to hear your thoughts!
            </Text>
            <Text mb={2}>
              Please share your feedback, suggestions, and any issues you encountered while using this demo website.
            </Text>
            <Text mb={2}>Your feedback is anonymous, so feel free to be as harsh or as detailed as you like :) </Text>
          </ModalBody>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              placeholder="Enter your feedback here..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="orange" onClick={handleFeedbackSubmit}>
              Submit
            </Button>
            <Button onClick={() => setIsFeedbackOpen(false)} ml={3}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Demo;
