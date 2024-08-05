import { Drawer, IconButton, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Menu, MenuButton, MenuList, MenuItem, Button, useDisclosure } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { MdFilterList } from "react-icons/md";

const FilterDrawer = ({ sortOrder, handleSortChange, currentFilter, filterMostLiked, filterMostDisliked, saveFilterAndCloseDrawer }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton aria-label="Filter" icon={<MdFilterList />} onClick={onOpen} position="fixed" top="250px" left="0px" zIndex="1" color="black" bg="white" _hover={{ bg: "gray.300" }} />
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent bg="gray.800" color="white">
            <DrawerCloseButton />

            <DrawerHeader>Filter Options</DrawerHeader>

            <DrawerBody>
              <Menu>
                <MenuButton mb={3} as={Button} rightIcon={<ChevronDownIcon />} colorScheme="red" variant="outline">
                  Sort by Username: {sortOrder === "a-z" ? "A-Z" : "Z-A"}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => handleSortChange("a-z")}>A-Z</MenuItem>
                  <MenuItem onClick={() => handleSortChange("z-a")}>Z-A</MenuItem>
                </MenuList>
              </Menu>
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="red" variant="outline">
                  {currentFilter}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={filterMostLiked}>Most Liked</MenuItem>
                  <MenuItem onClick={filterMostDisliked}>Most Disliked</MenuItem>
                </MenuList>
              </Menu>
              <Button
                pos="absolute"
                bottom="20px"
                right="20px"
                colorScheme="orange"
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
