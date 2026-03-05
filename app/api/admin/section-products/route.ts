import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SectionProduct from "@/models/SectionProduct";

// NOTE: Add proper admin authentication/authorization here before using in production.

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const sectionType = searchParams.get("sectionType");

    const query: Record<string, unknown> = {};
    if (sectionType) {
      query.sectionType = sectionType;
    }

    // Query MongoDB and explicitly include all fields
    const items = await SectionProduct.find(query)
      .populate("product")
      .sort({ sectionType: 1, order: 1 })
      .lean();

    console.log('GET /api/admin/section-products - Raw items count:', items.length);
    if (items.length > 0) {
      const firstItem = items[0];
      console.log('First item raw from DB (full object):', JSON.stringify(firstItem, null, 2));
      console.log('First item keys:', Object.keys(firstItem));
      console.log('First item features:', firstItem.features, 'type:', typeof firstItem.features);
      console.log('First item hotspots:', firstItem.hotspots, 'type:', typeof firstItem.hotspots);
      console.log('First item description:', firstItem.description, 'type:', typeof firstItem.description);
      console.log('First item buttonText:', firstItem.buttonText, 'type:', typeof firstItem.buttonText);
      console.log('Has description key:', 'description' in firstItem);
      console.log('Has features key:', 'features' in firstItem);
      console.log('Has hotspots key:', 'hotspots' in firstItem);
      console.log('Has buttonText key:', 'buttonText' in firstItem);
    }

    // Ensure all fields are included in the response - preserve empty arrays
    const itemsWithFields = items.map((item: any) => {
      // Start with all fields from the item
      const result: any = {
        ...item, // Include all fields from MongoDB
      };

      // For SPOTLIGHT items, ALWAYS include these fields (even if they don't exist in DB)
      if (item.sectionType === 'SPOTLIGHT') {
        // Always include description - check if field exists in item, use value or undefined
        if ('description' in item) {
          result.description = item.description !== null ? item.description : undefined;
        } else {
          result.description = undefined;
        }
        
        // Always include features - ensure it's always an array
        if ('features' in item) {
          result.features = Array.isArray(item.features) ? item.features : [];
        } else {
          result.features = [];
        }
        
        // Always include hotspots - ensure it's always an array
        if ('hotspots' in item) {
          result.hotspots = Array.isArray(item.hotspots) ? item.hotspots : [];
        } else {
          result.hotspots = [];
        }
        
        // Always include buttonText - check if field exists in item, use value or undefined
        if ('buttonText' in item) {
          result.buttonText = item.buttonText !== null ? item.buttonText : undefined;
        } else {
          result.buttonText = undefined;
        }
      }

      console.log('Processed item - sectionType:', result.sectionType);
      console.log('Processed item - Raw item keys:', Object.keys(item));
      console.log('Processed item - Raw item has description:', 'description' in item, item.description);
      console.log('Processed item - Raw item has features:', 'features' in item, item.features);
      console.log('Processed item - Raw item has hotspots:', 'hotspots' in item, item.hotspots);
      console.log('Processed item - Raw item has buttonText:', 'buttonText' in item, item.buttonText);
      console.log('Processed item - Result features:', result.features, 'type:', typeof result.features, 'isArray:', Array.isArray(result.features));
      console.log('Processed item - Result hotspots:', result.hotspots, 'type:', typeof result.hotspots, 'isArray:', Array.isArray(result.hotspots));
      console.log('Processed item - Result description:', result.description);
      console.log('Processed item - Result buttonText:', result.buttonText);
      console.log('Processed item - Final result keys:', Object.keys(result));
      return result;
    });

    // Final verification before sending response
    if (itemsWithFields.length > 0 && itemsWithFields[0].sectionType === 'SPOTLIGHT') {
      console.log('Final response for SPOTLIGHT - Full object:', JSON.stringify(itemsWithFields[0], null, 2));
      console.log('Final response - Has description:', 'description' in itemsWithFields[0]);
      console.log('Final response - Has features:', 'features' in itemsWithFields[0]);
      console.log('Final response - Has hotspots:', 'hotspots' in itemsWithFields[0]);
      console.log('Final response - Has buttonText:', 'buttonText' in itemsWithFields[0]);
    }

    return NextResponse.json(itemsWithFields);
  } catch (error) {
    console.error("Admin GET /section-products failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch section products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Build create object with all possible fields
    const createData: any = {
      product: body.productId,
      sectionType: body.sectionType,
      order: body.order ?? 0,
    };

    // Add badge if provided
    if (body.badge !== undefined) {
      createData.badge = body.badge;
    }

    // Add spotlight-specific fields if sectionType is SPOTLIGHT
    if (body.sectionType === 'SPOTLIGHT') {
      if (body.description !== undefined) {
        createData.description = body.description === '' ? null : body.description;
      }
      if (body.features !== undefined) {
        // Ensure features is always an array with proper structure
        if (Array.isArray(body.features)) {
          createData.features = body.features.map((f: any) => ({
            icon: f.icon || '',
            text: f.text || '',
          }));
        } else {
          createData.features = [];
        }
      }
      if (body.hotspots !== undefined) {
        // Ensure hotspots is always an array with proper structure
        if (Array.isArray(body.hotspots)) {
          createData.hotspots = body.hotspots.map((h: any) => ({
            position: {
              top: h.position?.top || undefined,
              bottom: h.position?.bottom || undefined,
              left: h.position?.left || undefined,
              right: h.position?.right || undefined,
            },
            title: h.title || '',
            description: h.description || '',
            color: h.color || '#22C55E',
          }));
        } else {
          createData.hotspots = [];
        }
      }
      if (body.buttonText !== undefined) {
        createData.buttonText = body.buttonText === '' ? null : body.buttonText;
      }
    }

    console.log('Creating section product with data:', createData);

    const item = await SectionProduct.create(createData);

    const populated = await item.populate("product");

    // Convert to plain object and ensure all fields are included
    const itemObj = populated.toObject ? populated.toObject() : populated;
    return NextResponse.json({
      ...itemObj,
      description: itemObj.description || undefined,
      features: itemObj.features || [],
      hotspots: itemObj.hotspots || [],
      buttonText: itemObj.buttonText || undefined,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Admin POST /section-products failed:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create section product", error: error.toString() },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Update multiple section products (for bulk updates like reordering)
    if (Array.isArray(body)) {
      const updates = body.map((item: { id: string; order?: number; badge?: string }) => ({
        updateOne: {
          filter: { _id: item.id },
          update: {
            ...(item.order !== undefined && { order: item.order }),
            ...(item.badge !== undefined && { badge: item.badge }),
          },
        },
      }));

      await SectionProduct.bulkWrite(updates);
      const updatedItems = await SectionProduct.find({
        _id: { $in: body.map((item: { id: string }) => item.id) },
      })
        .populate("product")
        .sort({ order: 1 })
        .lean();

      return NextResponse.json(updatedItems);
    }

    // Single update
    const { id, ...updateData } = body;
    
    console.log('PUT request body:', JSON.stringify(body, null, 2));
    console.log('Update data (after extracting id):', JSON.stringify(updateData, null, 2));
    
    // Build update object with all possible fields
    const updateFields: any = {};
    if (updateData.order !== undefined) updateFields.order = updateData.order;
    if (updateData.badge !== undefined) updateFields.badge = updateData.badge;
    
    // Handle spotlight-specific fields - ALWAYS set them if they're in the request
    // Check if this is a spotlight update by checking if these fields are present
    const isSpotlightUpdate = 'description' in updateData || 'features' in updateData || 'hotspots' in updateData || 'buttonText' in updateData;
    
    if (isSpotlightUpdate) {
      // Always set description (even if empty string, convert to null)
      if ('description' in updateData) {
        updateFields.description = updateData.description === '' || updateData.description === null ? null : updateData.description;
      }
      
      // Always set features (even if empty array) - MUST be included
      if ('features' in updateData) {
        if (Array.isArray(updateData.features)) {
          updateFields.features = updateData.features.length > 0 
            ? updateData.features.map((f: any) => ({
                icon: f.icon || '',
                text: f.text || '',
              }))
            : []; // Explicitly set empty array
        } else {
          updateFields.features = [];
        }
      }
      
      // Always set hotspots (even if empty array) - MUST be included
      if ('hotspots' in updateData) {
        if (Array.isArray(updateData.hotspots)) {
          updateFields.hotspots = updateData.hotspots.length > 0
            ? updateData.hotspots.map((h: any) => ({
                position: {
                  top: h.position?.top || undefined,
                  bottom: h.position?.bottom || undefined,
                  left: h.position?.left || undefined,
                  right: h.position?.right || undefined,
                },
                title: h.title || '',
                description: h.description || '',
                color: h.color || '#22C55E',
              }))
            : []; // Explicitly set empty array
        } else {
          updateFields.hotspots = [];
        }
      }
      
      // Always set buttonText (even if empty string, convert to null)
      if ('buttonText' in updateData) {
        updateFields.buttonText = updateData.buttonText === '' || updateData.buttonText === null ? null : updateData.buttonText;
      }
    }
    
    console.log('Update fields to save:', JSON.stringify(updateFields, null, 2));
    console.log('Update fields keys:', Object.keys(updateFields));
    
    // Use $set to ensure all fields are updated, including empty arrays
    const updateQuery: any = { $set: {} };
    
    // Add all fields to $set
    Object.keys(updateFields).forEach(key => {
      updateQuery.$set[key] = updateFields[key];
    });
    
    console.log('MongoDB update query:', JSON.stringify(updateQuery, null, 2));
    
    const item = await SectionProduct.findByIdAndUpdate(
      id,
      updateQuery,
      { new: true, runValidators: true, upsert: false }
    ).populate("product");
    
    if (!item) {
      return NextResponse.json(
        { message: "Section product not found" },
        { status: 404 }
      );
    }
    
    // Verify the update worked by fetching the document again
    const verifyItem = await SectionProduct.findById(id).lean();
    console.log('Verified item from DB after update:', JSON.stringify(verifyItem, null, 2));
    console.log('Verified features:', verifyItem?.features);
    console.log('Verified hotspots:', verifyItem?.hotspots);
    console.log('Verified description:', verifyItem?.description);
    console.log('Verified buttonText:', verifyItem?.buttonText);
    
    // Convert to plain object and ensure all fields are included
    const itemObj = item.toObject ? item.toObject() : item;
    const response: any = {
      ...itemObj,
    };
    
    // Always include spotlight fields in response - use verified data if available
    const dataToUse = verifyItem || itemObj;
    
    if (dataToUse.sectionType === 'SPOTLIGHT') {
      response.description = dataToUse.description !== undefined && dataToUse.description !== null ? dataToUse.description : undefined;
      response.features = Array.isArray(dataToUse.features) ? dataToUse.features : [];
      response.hotspots = Array.isArray(dataToUse.hotspots) ? dataToUse.hotspots : [];
      response.buttonText = dataToUse.buttonText !== undefined && dataToUse.buttonText !== null ? dataToUse.buttonText : undefined;
    } else {
      if (dataToUse.description !== undefined) response.description = dataToUse.description;
      if (dataToUse.features !== undefined) response.features = Array.isArray(dataToUse.features) ? dataToUse.features : [];
      if (dataToUse.hotspots !== undefined) response.hotspots = Array.isArray(dataToUse.hotspots) ? dataToUse.hotspots : [];
      if (dataToUse.buttonText !== undefined) response.buttonText = dataToUse.buttonText;
    }
    
    console.log('Final response being sent:', JSON.stringify(response, null, 2));
    console.log('Response features:', response.features);
    console.log('Response hotspots:', response.hotspots);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Admin PUT /section-products failed:", error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors || {}).map((err: any) => err.message);
      return NextResponse.json(
        { 
          message: "Validation error", 
          errors: validationErrors,
          details: error.toString()
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        message: error.message || "Failed to update section product",
        error: error.toString()
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const sectionType = searchParams.get("sectionType");

    if (id) {
      // Delete single item
      const item = await SectionProduct.findByIdAndDelete(id);
      if (!item) {
        return NextResponse.json(
          { message: "Section product not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ message: "Deleted successfully" });
    } else if (sectionType) {
      // Delete all items of a section type
      const result = await SectionProduct.deleteMany({ sectionType });
      return NextResponse.json({
        message: `Deleted ${result.deletedCount} items`,
        deletedCount: result.deletedCount,
      });
    } else {
      return NextResponse.json(
        { message: "Either id or sectionType must be provided" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Admin DELETE /section-products failed:", error);
    return NextResponse.json(
      { message: "Failed to delete section product" },
      { status: 500 }
    );
  }
}


