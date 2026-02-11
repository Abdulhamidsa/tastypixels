import {
  Drawer,
  IconButton,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { MdFilterList } from 'react-icons/md';
import React from 'react';

const FilterDrawer = ({
  sortOrder,
  handleSortChange,
  currentFilter,
  filterMostLiked,
  filterMostDisliked,
  filterMostCommented,
  filterHotPosts,
  filterPostedRecently,
  saveFilterAndCloseDrawer,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        aria-label="Filter"
        icon={<MdFilterList />}
        onClick={onOpen}
        position="fixed"
        top="150px"
        left="20px"
        zIndex="1"
        colorScheme="orange"
        variant="outline"
        // borderRadius="3px"
        _hover={{
          left: '0px',
        }}
        transition="left 0.3s ease"
      />
      <Drawer size="xs" isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent bg="#212121" color="white">
            <DrawerCloseButton />

            <DrawerHeader>Filter Options</DrawerHeader>

            <DrawerBody>
              <Menu>
                <MenuButton
                  mb={3}
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  colorScheme="black"
                  borderRadius="4px"
                  variant="outline"
                >
                  Sort by Username: {sortOrder === 'a-z' ? 'A-Z' : 'Z-A'}
                </MenuButton>
                <MenuList bg="#212121">
                  <MenuItem
                    bg="#212121"
                    _hover={{ bg: 'white', color: 'black' }}
                    onClick={() => handleSortChange('a-z')}
                  >
                    A-Z
                  </MenuItem>
                  <MenuItem
                    bg="#212121"
                    _hover={{ bg: 'white', color: 'black' }}
                    onClick={() => handleSortChange('z-a')}
                  >
                    Z-A
                  </MenuItem>
                </MenuList>
              </Menu>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  colorScheme="black"
                  borderRadius="4px"
                  variant="outline"
                >
                  {currentFilter}
                </MenuButton>
                <MenuList bg="#212121">
                  <MenuItem
                    bg="#212121"
                    color="white"
                    _hover={{ bg: 'white', color: 'black' }}
                    onClick={filterMostLiked}
                  >
                    Most Liked
                  </MenuItem>
                  <MenuItem
                    bg="#212121"
                    color="white"
                    _hover={{ bg: 'white', color: 'black' }}
                    onClick={filterMostDisliked}
                  >
                    Most Disliked
                  </MenuItem>
                  <MenuItem
                    bg="#212121"
                    color="white"
                    _hover={{ bg: 'white', color: 'black' }}
                    onClick={filterMostCommented}
                  >
                    Most Commented
                  </MenuItem>
                  <MenuItem
                    bg="#212121"
                    color="white"
                    _hover={{ bg: 'white', color: 'black' }}
                    onClick={filterHotPosts}
                  >
                    Hot Posts
                  </MenuItem>
                  <MenuItem
                    bg="#212121"
                    color="white"
                    _hover={{ bg: 'white', color: 'black' }}
                    onClick={filterPostedRecently}
                  >
                    Posted Recently
                  </MenuItem>
                </MenuList>
              </Menu>
              <Button
                pos="absolute"
                bottom="20px"
                right="20px"
                borderRadius="4px"
                colorScheme="green"
                variant="outline"
                onClick={() => {
                  saveFilterAndCloseDrawer();
                  onClose();
                }}
              >
                Save options
              </Button>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default FilterDrawer;
