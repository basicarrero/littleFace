module PostResourceResolver
  def post_resolver (p)
    p_attr = p.attributes
      if p.photos.length > 0
        resources = Cloudinary::Api.resources_by_ids(p.photos)['resources']
        p_attr['resources'] = []
        resources.each do |r|
          p_attr['resources'].push(r['url'])
        end
      end
    return p_attr
  end
  
  def postArray_resolver (posts)
    result = []
    if posts
      posts.each do |p|
        result.push(post_resolver(p))
      end
    end
    return result
  end
end
