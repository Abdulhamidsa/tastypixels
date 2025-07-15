import { useRef, useCallback } from "react";
import { Box, Skeleton } from "@chakra-ui/react";
import PostCard from "@/components/PostCard";
import useFetchData from "@/hooks/useFetchData";

const PostList = () => {
  const { uploads, loadingPosts, userData, loadMorePosts, hasMore } = useFetchData();
  const observer = useRef();

  const lastPostElementRef = useCallback(
    (node) => {
      if (loadingPosts) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("Load more posts triggered");
          loadMorePosts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingPosts, loadMorePosts, hasMore]
  );

  return (
    <Box>
      {uploads.map((upload, index) => {
        if (uploads.length === index + 1) {
          return (
            <div ref={lastPostElementRef} key={upload._id}>
              <PostCard upload={upload} userData={userData} isAuthenticated={true} handleVote={() => {}} handleReportClick={() => {}} loadingVote={false} handleOpen={() => {}} />
            </div>
          );
        } else {
          return <PostCard key={upload._id} upload={upload} userData={userData} isAuthenticated={true} handleVote={() => {}} handleReportClick={() => {}} loadingVote={false} handleOpen={() => {}} />;
        }
      })}
      {loadingPosts && <Skeleton height="100px" />}
    </Box>
  );
};

export default PostList;
